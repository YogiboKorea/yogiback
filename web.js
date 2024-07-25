const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (옵션)
app.use(express.static(path.join(__dirname, 'public')));

let db;

const MONGO_URI = 'mongodb+srv://yogibo:yogibo@cluster0.vvkyawf.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('MongoDB 연결 오류:', err);
        return;
    }
    db = client.db('yogibo');
    console.log('MongoDB에 연결되었습니다.');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

// Nodemailer 설정
const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
        user: 'yogibo',
        pass: 'F19M14GGDCHH' // 본인이 생성한 앱 비밀번호 사용
    }
});

// 이미지를 업로드하기 위한 Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 메일 보내기 함수 (이미지 첨부)
const sendEmailWithAttachment = (to, subject, text, imageBuffer) => {
    const mailOptions = {
        from: 'yogibo@naver.com',
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'image.jpg',
                content: imageBuffer,
                encoding: 'base64',
                cid: 'unique@nodemailer.com'
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('이메일 전송 성공:', info.response);
    });
};

// 회원 데이터 가져오는 API
app.get('/member-data/:memberId', (req, res) => {
    const { memberId } = req.params;
    db.collection('events').findOne({ memberId }, (err, result) => {
        if (err) {
            console.error('데이터베이스 조회 오류:', err);
            return res.status(500).json({ error: '데이터베이스 오류' });
        }
        res.json(result);
    });
});

// 회원ID가 이미 등록되었는지 확인하는 API
app.get('/check-member/:memberId', (req, res) => {
    const { memberId } = req.params;
    db.collection('events').findOne({ memberId }, (err, result) => {
        if (err) {
            console.error('데이터베이스 조회 오류:', err);
            return res.status(500).json({ error: '데이터베이스 오류' });
        }
        res.json({ exists: !!result });
    });
});

// 이미지 및 텍스트 업로드 처리
app.post('/upload', upload.single('image'), (req, res) => {
    const { eventName, phoneNumber, goldNumber, sliverNumber, bronzeNumber, memberId } = req.body;
    const memberIdValue = memberId || '오프라인주문'; // memberId가 없을 경우 '오프라인주문'으로 설정

    if (!eventName || !phoneNumber || !goldNumber || !sliverNumber || !bronzeNumber) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const eventData = {
        eventName,
        phoneNumber,
        goldNumber,
        sliverNumber,
        bronzeNumber,
        memberId: memberIdValue,
        createdAt: new Date()
    };

    db.collection('events').insertOne(eventData, (err, result) => {
        if (err) {
            console.error('데이터베이스 삽입 오류:', err);
            return res.status(500).json({ error: '데이터베이스 오류' });
        }

        const emailText = `이벤트명: ${eventName}\n연락처: ${phoneNumber}\n금메달: ${goldNumber}개\n은메달: ${sliverNumber}개\n동메달: ${bronzeNumber}개\n회원ID: ${memberIdValue}`;

        if (req.file) {
            const imageBuffer = req.file.buffer;
            sendEmailWithAttachment('yogibo@naver.com', '금/은/동 이벤트참여.', emailText, imageBuffer);
        } else {
            sendEmailWithAttachment('yogibo@naver.com', '금/은/동 이벤트참여.', emailText);
        }

        res.status(201).json({ message: '데이터가 성공적으로 저장되었습니다.', data: result.ops[0] });
    });
});
