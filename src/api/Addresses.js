const lumenServer = process.env.VUE_APP_LUMEN_INTERNAL_API_SERVER
// const lumenRabbitMQ = process.env.VUE_APP_LUMEN_RABBIT_MQ_API_SERVER
const authServer = process.env.VUE_APP_AUTH_INTERNAL_API_SERVER

const API_ADDRESS = {
  server: {
    lumen: lumenServer,
    auth: authServer
  },
  auth: {
    login: authServer + '/login'
  },
  user: {
    base: authServer + '/user',
    mobile: {
      resend: authServer + '/mobile/resend',
      verify: authServer + '/mobile/verify'
    },
    formData: authServer + '/megaroute/getUserFormData',
    show_user: authServer + '/getUserFor3a'
  },
  set: {
    base: authServer + '/set',
  },
  content: {
    base: authServer + '/c',
  },
  exam: {
    sendAnswers: lumenServer + '/temp-exam/answer/choice',
    sendStatus: lumenServer + '/temp-exam/answer/status',
    sendBookmark: lumenServer + '/temp-exam/answer/bookmark',
    sendUnBookmark: lumenServer + '/temp-exam/answer/unbookmark',
    userExamsList: lumenServer + '/examAndUser',
    takhminRotbe: lumenServer + '/exam-report/rankSimulator',
    examReportIndex (type) { return lumenServer + '/exam-report/index/' + type },
    base (page_number) {
      if (page_number) {
        return lumenServer + '/exam?page=' + page_number
      } else {
        return lumenServer + '/exam'
      }
    },
    generateExamFile (exam_id, with_answer) {
      const baseFileRoute = lumenServer + '/exam-question/file/' + exam_id
      return with_answer ? (baseFileRoute + '/with_answer') : baseFileRoute
    },
    getAnswerOfUser (user_exam_id) {
      return lumenServer + '/temp-exam/answer/'+user_exam_id
    },
    getAllAnswerOfUser (user_exam_id) {
      return lumenServer + '/temp-exam/allAnswer/'+user_exam_id
    },
    getSubCategoriesWithPermissions (exam_id) {
      return lumenServer + '/exam-question/show/sub-categories/'+ exam_id
    },
    getAnswerOfUserWithCorrect (user_exam_id) {
      return lumenServer + '/temp-exam/answer/'+user_exam_id+'/withCorrect'
    },
    registerExam: lumenServer + '/user/registerExam',
    examUser: lumenServer + '/exam-user',
    examQuestion (quizId) {
      return lumenServer + '/exam-question/attach/show/' + quizId
    },
    report: {
      getReport (userExamId) {
        return lumenServer + '/exam-report/show?user_exam_id=' + userExamId
      }
    },
    examBookletUpload (exam_id) {
      return lumenServer + '/exam-question/booklet-file/' + exam_id
    }
  },
  question: {
    index: lumenServer + '/question/search-monta',
    base: lumenServer + '/exam-question/attach',
    attachSubCategoryToQuestion: lumenServer + '/exam-question/attach/sub-category',
    updateQuestion (questionId) {
      return lumenServer + '/question/' + questionId
    },
    attach: lumenServer + '/exam-question/attach/v2',
    detach (questionId) {
      return lumenServer + '/exam-question/detach/'+questionId
    },
    delete (questionId) {
      return lumenServer + '/question/'+questionId
    },
    getCurrentQuestion (questionId) {
      return lumenServer + '/question/' + questionId
    },
    confirm (questionId) {
      return lumenServer + '/question/confirm/' + questionId
    }
  },
  questionSubcategory: {
    base: lumenServer + '/sub-category',
    update (id) {
      return lumenServer + '/sub-category/' + id
    }
  },
  questionCategory: {
    base: lumenServer + '/category',
    update (id) {
      return lumenServer + '/category/' + id
    }
  }
}
export default API_ADDRESS
