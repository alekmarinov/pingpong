import React from 'react';
import ReactDOM from 'react-dom'; 
import { Provider, connect } from 'react-redux';
import { createEpicMiddleware, combineEpics, ofType } from 'redux-observable';
import { createStore, applyMiddleware } from 'redux';
import { delay, mapTo } from 'rxjs/operators'

const pingPongReducer = (state = {}, action) => action

const pingPongEpic = (filterType, emitType) => action$ => action$.pipe(
    ofType(filterType),
    delay(1000),
    mapTo({ type: emitType })
);

const rootEpic = combineEpics(
    pingPongEpic('PING', 'PONG'),
    pingPongEpic('PONG', 'PING')
);

const epicMiddleware = createEpicMiddleware();
const store = createStore(pingPongReducer, { type: 'PING' }, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);

const mapStateToProps = (state) => ({...state});

const App = connect(mapStateToProps)(props =>
    <h1>{props.type}</h1>
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

store.dispatch({ type: 'PING' });
