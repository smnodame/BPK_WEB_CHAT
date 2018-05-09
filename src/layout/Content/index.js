import _ from 'lodash'
import $ from 'jquery'

import React from 'react'
import AudioPlayer from '../../components/AudioPlayer'

class Content extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sticker: [],
            collectionKeySelected: 0
        }
    }

    componentWillReceiveProps() {
        if(_.get(this.props.data, 'chat.sticker')) {
            this.setState({
                sticker: this.props.data.chat.sticker || []
            })
        }
    }
    
    render_sticker_collection = () => {
        return this.state.sticker.map((item) => {
            return (
                <img src={item.collection_image_url} style={{ width: '90px', padding: '15px', height: '80px', cursor: 'pointer' }}  onClick={() => {
                    this.setState({
                        collectionKeySelected: item.key
                    })
                }} />
            )
        })
    }

    render_sticker = () => {
        return _.get(this.state.sticker, `${this.state.collectionKeySelected}.sticker_lists`, []).map((item) => {
            return (
                <img src={item.url} style={{ width: '145px', padding: '15px', cursor: 'pointer' }}  />
            )
        })
    }

    _image_upload_handler = (e) => {
        console.log(e)
    }

    _file_upload_handler = (e) => {
        console.log(e)
    }

    render() {
        return (
            <div className="col-sm-8 conversation">
                <div className="row heading header-chat">
                    <div className="col-sm-2 col-md-1 col-xs-3 heading-avatar">
                        <div className="heading-avatar-icon">
                            <img src="https://bootdey.com/img/Content/avatar/avatar6.png" />
                        </div>
                    </div>
                    <div className="col-sm-8 col-xs-7 heading-name">
                        <a className="heading-name-meta">John Doe
                        </a>
                        <span className="heading-online">Online</span>
                    </div>
                    <div className="col-sm-1 col-xs-1  heading-dot pull-right">
                        <i className="fa fa-search fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                </div>

                <div className={!!this.state.show_addi_footer? 'row message message-small': 'row message' }>
                    <div className="row message-previous">
                        <div className="col-sm-12 previous">
                            <a onclick="previous(this)" name="20">
                                Show Previous Message!
                            </a>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-receiver">
                            <div className="receiver">
                                <div className="message-text">
                                    Hi, what are you doing?!
                                </div>
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-receiver">
                            <div className="receiver">
                                <img src="http://smnodame.com/public/profile.jpg" style={{ width: '200px' }}  />
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row message-body">
                        <div className="col-sm-12 message-main-receiver">
                            <div className="receiver">
                                <div style={{ display: 'flex' }}>
                                    <i className="fa fa-file" aria-hidden="true" style={{ fontSize: '28px', color: '#3a6d99', backgroundColor: 'rgba(218,228,234,.5)', padding: '5px', textAlign: 'center', paddingTop: '8px', width: '69px', borderRadius: '50%' }}></i>
                                    <div style={{     paddingLeft: '12px' }}>
                                        <p style={{ margin: '0px', fontWeight: 'bold', color: '#3a6d99' }}>Hello world</p>
                                        <p style={{ margin: '0px', color: '#3a6d99' }}>Download</p>
                                    </div>
                                </div>
                                <p className="message-time pull-right">
                                    Sun
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender">
                                <AudioPlayer />
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender">
                                <div className="message-text">
                                    Hi, what are you doing?!
                                </div>
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender">
                                <img src="http://smnodame.com/public/profile.jpg" style={{ width: '200px' }}  />
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender sticker">
                                <img src="http://itsmartone.com/bpk_connect/upload_chat_sticker/BPK/1.png" style={{ width: '150px' }}  />
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender">
                                <div style={{ display: 'flex', cursor: 'pointer' }}>
                                    <i className="fa fa-file" aria-hidden="true" style={{ fontSize: '28px', color: '#3a6d99', backgroundColor: 'rgba(218,228,234,.5)', padding: '5px', textAlign: 'center', paddingTop: '8px', width: '69px', borderRadius: '50%' }}></i>
                                    <div style={{     paddingLeft: '12px' }}>
                                        <p style={{ margin: '0px', fontWeight: 'bold', color: '#3a6d99' }}>Hello world</p>
                                        <p style={{ margin: '0px', color: '#3a6d99' }}>Download</p>
                                    </div>
                                </div>
                                <p className="message-time pull-right">
                                    Sun
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row message-body">
                        <div className="col-sm-12 message-main-sender">
                            <div className="sender">
                                <div className="message-text">
                                    I am doing nothing man!
                                </div>
                                <span className="message-time pull-right">
                                    Sun
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <input id="image-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._image_upload_handler} aria-describedby="fileHelp" />
                <input id="file-upload" type="file" className="form-control-file" style={{ display: 'none' }} onChange={this._file_upload_handler} aria-describedby="fileHelp" />

                <div className="row reply">
                    <div style={{ display: 'flex' }}>
                        <i className="fa fa-smile-o fa-2x" style={{ padding: '10px', color: '#93918f' }} onClick={() => {
                            this.setState({
                                show_addi_footer: !this.state.show_addi_footer
                            })
                        }}></i>
                        <i className="fa fa-file-image-o fa-2x" style={{ padding: '10px', color: '#93918f' }} 
                            onClick={() => {
                                $('#image-upload').trigger('click')
                            }}
                        ></i>
                        <i className="fa fa-file-o fa-2x" style={{ padding: '10px', color: '#93918f' }}
                            onClick={() => {
                                $('#file-upload').trigger('click')
                            }}
                        ></i>
                        <textarea className="form-control" rows="1" id="comment" style={{ marginLeft: '10px', marginRight: '10px' }}></textarea>
                        <i className="fa fa-microphone fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }}></i>
                        <i className="fa fa-send fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }}></i>
                    </div>
                    
                </div>
                <div style={{ overflowY: 'scroll', height: '200px', backgroundColor: 'white' }}>
                    <div style={{ overflowX: 'auto', display: 'flex', height: '80px', backgroundColor: 'rgb(251, 251, 251)', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        {
                            this.render_sticker_collection()
                        }
                    </div>
                    {
                        this.render_sticker()
                    }
                </div>
            </div>
        )
    }
}

export default Content
