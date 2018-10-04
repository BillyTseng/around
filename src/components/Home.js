import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS, POS_KEY } from "../constant";

const TabPane = Tabs.TabPane;

const operations = <Button>Extra Action</Button>;
export class Home extends React.Component {
    state = {
        loadGeoLocation: false,
        error: ''
    }
    componentDidMount() {
        this.setState({loadGeoLocation: true, error: ''});
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if ( "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS
            )
        } else {
            this.setState({error: 'Your browser does not support geo location.'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({latitude, longitude}));
        this.setState({loadGeoLocation: false, error: ''});
    }

    onFailedLoadGeoLocation = (error) => {
        console.log(error);
        this.setState({loadGeoLocation: false, error: 'Failed to load geo location!'});
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadGeoLocation) {
            return <Spin tip="Loading geo locations..."/>;
        } else {
            return null;
        }
    }

    render() {
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">Content of tab 2</TabPane>
            </Tabs>
        );
    }
}
