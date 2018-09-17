





const initialState = {
  message: '',
  title: '',
  content: '',
  date: '',
  author: {
    uid: '',
    name: '',
    schoolName: '',
    clubName: '',
    status: '',
    photoUrl: '',
  },
  views: 0,
  favorites: 0,
  view: {
    uid: {
      name: ''
    }
  },
  favorite: {
    uid: {
      name: ''
    }
  },
  images: [],
  comment: {
    uid: {
      name: '',
      schoolName: '',
      clubName: '',
      status: '',
      content: '',
      photoUrl: '',
    }
  }
}

export const postReducer = (state = initialState, action) => {
  switch(action.type) {

    default:
      return state
  }
}