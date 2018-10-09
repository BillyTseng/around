import React from 'react';
import { Button, Modal, message } from 'antd';
import $ from 'jquery';
import { WrappedCreatePostForm } from "./CreatePostForm"
import { API_ROOT, POS_KEY, AUTH_PREFIX, TOKEN_KEY } from "../constant"

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.form.validateFields((err, values) => {
           if (!err) {
               const { latitude, longitude } = JSON.parse(localStorage.getItem(POS_KEY));
               console.log(`${latitude} ${longitude}`)
               console.log(values);

               const formData = new FormData();
               formData.set('lat', latitude);
               formData.set('lon', longitude);
               formData.set('message', values.message);
               formData.set('image', values.image[0].originFileObj);

               $.ajax({
                   url: `${API_ROOT}/post`,
                   method: 'POST',
                   data: formData,
                   headers: {
                       Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                   },
                   processData: false,
                   contentType: false,
                   dataType: 'text',
               }).then(
                   () => {
                   message.success('Created a post successfully!');
                   this.form.resetFields();
                   this.setState({ visible: false, confirmLoading: false });
                   this.props.loadNearbyPost();
               }, (response) => {
                   message.error(response.responseText);
                   this.setState({ visible: false, confirmLoading: false });
               }).catch((error) => {
                   console.log(error);
               });
           }
        });
        // this.setState({
        //     visible: false,
        // });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create Post Button</Button>
                <Modal
                    title="Create New Post"
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <WrappedCreatePostForm ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}