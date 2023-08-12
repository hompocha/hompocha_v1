# 홈술포차

## 개요
### 팀원
- 김서영
- 김주현
- 방우현
- 이성균 팀장
- 전승규

### 프로젝트 기간
- 프로젝트 진행 기간: 2023년 7월 2일 ~ 2023년 8월 11일 (약 6주)

### 기획의도
- 친구들과 술자리를 가지는데 바쁜 일상에 체력적, 시간적으로 부담인 분들
- 밖에서 사먹는 술값이 너무 비싼 분들
- 이런 분들께서 집에서 재미있고 편하게 술을 마실 수 있도록 하는 서비스

### 주요 기능
- **다자간 영상통화**로 비대면으로 술자리를 가질 수 있습니다.
- **대화 보조 기능**과 **미니게임**을 통해 대화에 재미를 더해줍니다.
- **음성 인식** 과 **동작 인식**을 통해 마우스, 키보드 사용을 줄여 손쉽게 이용할 수 있습니다.


## 상세

### 메인 화면
![KakaoTalk_Photo_2023-08-11-22-18-35 007](https://github.com/hompocha/hompocha_v1/assets/58359639/158a95ad-9f4a-4d4d-b2a2-c44e87ad1d9d)

### 대화 화면
![KakaoTalk_Photo_2023-08-11-22-22-11](https://github.com/hompocha/hompocha_v1/assets/58359639/748c3d9c-e157-4b87-81b9-118e40073b16)

#### 대화 보조 기능 💬

##### 다양한 테마
![테마 바꾸기](https://github.com/hompocha/hompocha_v1/assets/58359639/ed31dc12-4df0-446d-ba56-1aec6729dea1)


##### 건배 기능🍻
![KakaoTalk_Photo_2023-08-11-22-18-35 005](https://github.com/hompocha/hompocha_v1/assets/58359639/0eb19246-a103-4704-b632-10cb268104f8)

##### 돌리기 기능🎰
![KakaoTalk_Photo_2023-08-11-22-18-35 006](https://github.com/hompocha/hompocha_v1/assets/58359639/b5323aae-433d-4c24-9c88-6df0f04da036)

##### 사진 찍기📷
![KakaoTalk_Photo_2023-08-11-22-18-35 004](https://github.com/hompocha/hompocha_v1/assets/58359639/28cc61e8-854f-4f48-8524-3928160e9064)

##### 키워드 이펙트🍗
![KakaoTalk_Photo_2023-08-11-22-18-35 008](https://github.com/hompocha/hompocha_v1/assets/58359639/13f4a855-39cc-40ed-9cb0-7ab4fb2763ab)


#### 미니 게임

##### 발음 게임🗣️
![KakaoTalk_Photo_2023-08-11-22-18-35 001](https://github.com/hompocha/hompocha_v1/assets/58359639/812affae-30e2-4af2-a3d9-0ffdabdd6eef)

##### 소맥 게임🍺
![KakaoTalk_Photo_2023-08-11-22-18-35 003](https://github.com/hompocha/hompocha_v1/assets/58359639/3bf9d721-00df-45f1-8ad9-93f9dcf4cfe6)

##### 피하기 게임😵
![KakaoTalk_Photo_2023-08-11-22-18-35 002](https://github.com/hompocha/hompocha_v1/assets/58359639/96997ab0-a12f-4b35-9893-54d1c1a6084d)

### 아키텍처
![image](https://github.com/hompocha/hompocha_v1/assets/58359639/632e4171-c17f-4976-b21c-78ab83fe97aa)



### 기술적챌린지
#### 건배 이펙트 드로잉 위치 동기화
![image](https://github.com/hompocha/hompocha_v1/assets/58359639/eae13f6e-9494-4854-b8c2-01ccd712e7b7)

- Problem : 클라이언트에서 미디어파이프를 사용하여 받는 손의 좌표가 사용자의 캠의 위치에 따라 달라지는 문제
- Solution : ComputedStyle을 이용해서 전체 좌표계를 통합하는 함수를 만들고, 사용자의 위치에 맞게 맥주잔이 그려지게 구현
### 손 동작 인식
![image](https://github.com/hompocha/hompocha_v1/assets/58359639/3e9552c6-e6cc-49a1-87c1-69dac944a996)
![image](https://github.com/hompocha/hompocha_v1/assets/58359639/6b087905-762f-456e-bcaa-a258d82c9eb3)

#### 손으로 잡는 동작 인식
- 잡는 동작을 정확하게 구현하기 위해 카메라와 거리에 따라 달라지는 ⓪을 보정 필요
- ①, ②, ③ 의 합으로 ⓪의 길이의 비율을 구해 보완

#### 컵을 들지 않은 손동작 구분
- 컵을 들었을 때, 컵의 축 ②와 y축과 이루는 각 ∠a을 계산하여 ∠a에 따라 컵 이미지 출력 결정

### 트러블슈팅
#### 게임 시작 동기화
- Problem : 클라이언트별 로딩 속도 차이로 인해 사용자들 사이의 게임 시작 시간이 일치하지 않는 상황 발생
- Solution : WebSocket 통신 활용, 사용자 로딩 완료 시 호스트에게 알림 전송. 호스트는 모든 사용자의 로딩 완료 알림을 수신 후 게임 시작 신호 전송, 이를 통해 사용자 간 게임 시작 시간 동기화
#### 음성인식 중복 입력
- Problem : 특정 키워드 인식 후 계속해서 문장을 받아와 음성인식 키워드 중복 입력 문제 발생
- Solution : 특정 키워드 인식 시 음성인식 기능 일시 중지 후 재활성화로 문제 대응

