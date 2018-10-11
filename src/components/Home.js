import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import $ from 'jquery';
import { API_ROOT, GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY } from "../constant";
import { Gallery } from "./Gallery";
import {CreatePostButton} from "./CreatePostButton";
import { WrappedAroundMap} from "./AroundMap";

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        loadGeoLocation: false,
        loadingPosts: false,
        posts: [],
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
        this.setState({loadingPosts: true, loadGeoLocation: false, error: ''});
        this.loadNearbyPost();
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
        } else if (this.state.loadingPosts) {
            return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
            return <Gallery  images={
                this.state.posts.map(({ user, message, url}) => ({
                    user,
                    src: url,
                    thumbnail: url,
                    caption: message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                }))
            }/>;
        } else {
            return null;
        }
    }

    loadNearbyPost = () => {
        this.setState({loadingPosts: true});
        const { latitude, longitude } = JSON.parse(localStorage.getItem(POS_KEY));
        $.ajax({
            url: `${API_ROOT}/search?lat=${latitude}&lon=${longitude}&range=20`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            }
        }).then((response) => {
            this.setState({ posts: response, loadingPosts: false, error: '' });
            console.log(response);
        }, (error) => {
            this.setState({ loadingPosts: false, error: error.responseText });
            console.log(error);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const createPostButton = <CreatePostButton
            loadNearbyPost={this.loadNearbyPost}
        />;
        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </TabPane>
            </Tabs>
        );
    }
}
