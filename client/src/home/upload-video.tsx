import React, { Component } from 'react';
import basics from '../basics.json';
import axios from 'axios';

export default class UploadVideo extends Component {
    state = {
        video: ""
    }  
    
    handleChange = (event : any) => {
        event.preventDefault();
        this.setState({ video: event.target.files[0] })
    }

    handleSubmit = async (event : any) => {
        event.preventDefault();
        const formData = new FormData(); 
        formData.append("file", this.state.video); 
        
        await axios({ 
            url: `${basics.BACKEND_URL_HOST}/upload-video`,
            method: 'POST',
            data: formData
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })
    }
 
    render() {
        return (
            <div className="container">
                <div className="row">
                    <form>
                        <div className="form-group">
                            <input type="file" accept="video/*" name="file" required onChange={this.handleChange} />
                            <input type="submit" onClick={this.handleSubmit} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}