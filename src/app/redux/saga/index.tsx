
import { all } from 'redux-saga/effects';
import authSaga from './auth.saga';
import profileSaga from './profile.saga';
import categorySaga from './category.saga';
import staffSaga from './staff.saga';
import courseSaga from './course.saga';
import topicSaga from './topic.saga';
import QuestionSaga from './question.saga';
import QuizSaga from './quiz.saga';
import BannerSaga from './banner.saga';
import StudentSaga from "./student.saga"
import EnquirySaga from './enquires.saga';

// console.log("rootSaga1")
export default function* rootSaga() {
  // console.log("rootSaga")
  yield all([
    authSaga(),
    profileSaga(),
    categorySaga(),
    staffSaga(),
    courseSaga(),
    topicSaga(),
    QuestionSaga(),
    QuizSaga(),
    BannerSaga(),
    StudentSaga(),
    EnquirySaga()
  ]);
}
