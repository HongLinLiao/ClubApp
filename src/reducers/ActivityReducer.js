

const initialState = {
    allActivity: {}, //所有活動
    reloader: {
        home: false,
        club: false,
        search: true,
    }, //首頁活動開關
}

export const ActivityReducer = (state = initialState, action) => {
    switch (action.type) {

        default:
            return state
    }
}