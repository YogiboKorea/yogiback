# 올림픽 기간 금/은/동 수치 맞추기 이벤트 개발 

## 개요
- **이벤트 목표**: 올림픽 기간 동안 고객들이 금, 은, 동 메달 수치를 예측하는 이벤트를 통해 참여를 유도하고, 각 고객의 참여 내역과 당첨 결과를 개인정보 페이지에서 확인할 수 있도록 구현.
- **참여 제한**: 고객별로 이벤트 참여는 단 한 번만 가능하며, 참여 후 당첨 발표 전까지 참여 내역을 열람할 수 있음.

## 주요 기능

1. **이벤트 참여 및 참여 기록 관리**
   - 고객별로 1회만 참여 가능하도록 제한하여 공정한 이벤트 운영.
   - 이벤트 참여 시, 고객의 참여 내역과 메달 수치 예측 데이터가 MongoDB에 저장되어 참여 카운터로 관리.

2. **개인정보 페이지 연동**
   - 참여 고객은 본인의 개인정보 페이지에서 자신이 참여한 이벤트 내역 및 예측 결과를 확인할 수 있도록 구현.
   - 당첨 발표 전까지 참여 기록을 지속적으로 열람할 수 있는 기능 제공.

3. **이메일 전송 및 기록 관리**
   - nodemailer를 활용하여 이벤트 참여 고객의 정보를 이메일로 전송하고, 그 기록을 남김.
   - 이벤트 참여 인원에 대한 데이터 전송 기록을 통해 참여 현황을 모니터링하고, 추가 이벤트 분석에 활용.

## 데이터 관리 및 기술 스택
- **데이터베이스**: MongoDB를 활용하여 고객별 참여 카운터와 이벤트 참여 내역 저장
- **이메일 전송**: nodemailer를 이용하여 이벤트 참여 고객의 데이터 전송 기록을 관리
- **개인정보 페이지**: 고객이 참여 내역 및 당첨 결과를 확인할 수 있는 UI 구현

