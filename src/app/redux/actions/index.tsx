import * as TYPES from "./types";

export const loginAction = (payload: any, callBack: any) =>
  // console.log("payloade ------->",payload),
  ({
    type: TYPES["LOGIN_ACTION"],
    payload,
    callBack,
  });

export const logoutAction = (callBack: any) => ({
  type: TYPES["LOGOUT"],
  callBack,
});

export const getProfileAction = () => ({ type: TYPES["GET_PROFILE"] });

export const editProfileAction = (payload: any, callBack: any) => ({
  type: TYPES["EDIT_PROFILE"],
  payload,
  callBack,
});

export const changePassword = (payload: any, callback: any) => ({
  type: TYPES["CHANGE_PASSWORD"],
  payload,
  callback,
});

//CATEGORY------------------------------------------------------------

export const addCategoryAction = (payload: any, callBack: any) =>
  // console.log("addcategory action",payload),
  ({
    type: TYPES["ADD_CATEGORY"],
    payload,
    callBack,
  });

export const listCatgoryAction = (payload: any, callBack: any) =>
  // console.log("payload ",payload),
  ({ type: TYPES["LIST_CATEGORY"], payload, callBack });

export const getSingleCategoryAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["GET_SINGLE_CATEGORY"], payload, callBack });

export const updateCategoryAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["UPDATE_CATEGORY"], payload, callBack });

export const deleteCategoryAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["DELETE_CATEGORY"], payload, callBack });





//STAFF
export const addStaffAction = (payload: any, callBack: any) => ({
  type: TYPES["ADD_STAFF"],
  payload,
  callBack,
});
export const listStaffAction = (callBack: any) =>
  // console.log("payload ",payload),
  ({ type: TYPES["GET_STAFF"],  callBack });

export const getSingleStaffAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["SINGLE_STAFF"], payload, callBack });

export const updateStaffAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["UPDATE_STAFF"], payload, callBack });

export const deleteStaffAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["DELETE_STAFF"], payload, callBack });





//COURSE

export const addCourseAction = (payload: any, callBack: any) =>
  // console.log("addcourse action",payload),
  ({
    type: TYPES["ADD_COURSE"],
    payload,
    callBack,
  });

export const listCourseAction = (payload: any, callBack: any) =>
  // console.log("payload ",payload),
  ({ type: TYPES["GET_COURSE"], payload, callBack });

export const getSingleCourseAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["SINGLE_COURSE"], payload, callBack });

export const updateCourseAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["UPDATE_COURSE"], payload, callBack });

export const deleteCourseAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["DELETE_COURSE"], payload, callBack });

//topic
export const addTopicAction = (payload: any, callBack: any) =>
  // console.log("addcourse action",payload),
  ({
    type: TYPES["ADD_TOPIC"],
    payload,
    callBack,
  });

export const listTopicAction = (callBack: any) =>
  // console.log("payload ",payload),
  ({ type: TYPES["GET_TOPIC"], callBack });

export const getSingleTopicAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["SINGLE_TOPIC"], payload, callBack });

export const updateTopicAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["UPDATE_TOPIC"], payload, callBack });

export const deleteTopicAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["DELETE_TOPIC"], payload, callBack });

//Question

export const addQuestionAction = (payload: any, callBack: any) => ({
  type: TYPES["ADD_QUESTION"],
  payload,
  callBack,
});

export const listQuestionAction = (payload: any, callBack: any) => ({
  type: TYPES["GET_QUESTION"],
  callBack,
  payload,
});

export const getSingleQuestionAction = (payload: any, callBack: any) => ({
  type: TYPES["SINGLE_QUESTION"],
  payload,
  callBack,
});

export const updateQuestionAction = (payload: any, callBack: any) => ({
  type: TYPES["UPDATE_QUESTION"],
  payload,
  callBack,
});

export const deleteQuestionAction = (payload: any, callBack: any) => ({
  type: TYPES["DELETE_QUESTION"],
  payload,
  callBack,
});

//Quiz

export const addQuizAction = (payload: any, callBack: any) => ({
  type: TYPES["ADD_QUIZ"],
  payload,
  callBack,
});

export const listQuizAction = (payload: any, callBack: any) => ({
  type: TYPES["GET_QUIZ"],
  callBack,
  payload,
});

export const getSingleQuizAction = (payload: any, callBack: any) => ({
  type: TYPES["SINGLE_QUIZ"],
  payload,
  callBack,
});

export const updateQuizAction = (payload: any, callBack: any) =>
  // console.log(payload,"index---------------------------------"),
  ({ type: TYPES["UPDATE_QUIZ"], payload, callBack });

export const deleteQuizAction = (payload: any, callBack: any) => ({
  type: TYPES["DELETE_QUIZ"],
  payload,
  callBack,
});
export const approvalQuizAction = (payload: any, callBack: any) => ({
  type: TYPES["APPROVAL"],
  payload,
  callBack,
});

//questionByCourse
export const questionByCourseAction = (payload: any, callBack: any) =>
  // console.log(payload),
  ({ type: TYPES["QUESTION_BY_COURSE"], payload, callBack });

//banner

export const addBannerAction = (payload: any, callBack: any) => ({
  type: TYPES["ADD_BANNER"],
  payload,
  callBack,
});

export const listBannerAction = (callBack: any) => ({
  type: TYPES["GET_BANNER"],
  callBack,
});

export const getSingleBannerAction = (payload: any, callBack: any) => ({
  type: TYPES["SINGLE_BANNER"],
  payload,
  callBack,
});

export const updateBannerAction = (payload: any, callBack: any) =>
  // console.log(payload,"index---------------------------------"),
  ({ type: TYPES["UPDATE_BANNER"], payload, callBack });

export const deleteBannerAction = (payload: any, callBack: any) => ({
  type: TYPES["DELETE_BANNER"],
  payload,
  callBack,
});



// STUDENT 
export const listStudentAction = (payload: any, callBack: any) => ({
  type: TYPES["GET_STUDENT"],
  callBack,
  payload,
});


// enquiry details 
export const listEnquiryDetailsAction = (payload: any, callBack: any) => ({
  type: TYPES["GET_ENQUIRY_DETAILS"],
  callBack,
  payload,
});
