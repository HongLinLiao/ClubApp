import React from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {

    class ActivityReloader extends React.Component {

        handleReload = () => {
            const { reloader } = this.props;
        }

        componentWillMount() {

        }

        componentWillUpdate(nextProps) {

        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    const mapStateToProps = ({ ActivityReducer }) => ({
        reloader: ActivityReducer.reloader,
    });



    return connect(mapStateToProps)(ActivityReloader)
}