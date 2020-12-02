# route to use

1) localhost:1234/createParticipant ===> for creating participants

2) localhost:1234/meetings?emails=abhijeetrajak10@gmail.com,avirav01@gmail.com
   ===> create meeting

3) localhost:1234/meeting/5fc7d7cf19477f50fc5c41a4 ===> get meeting by id

4) localhost:1234/meetings?start=2020/12/02 20:30:00&end=2020/12/3
   00:30:00&page=1&limit=2 ===> get meeting by start and end time

5) localhost:1234/meetings?participants=abhijeetrajak10@gmail.com&page=2&limit=2
   ===> get meeting by email
