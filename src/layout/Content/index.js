import React from 'react'
import AudioPlayer from '../../components/AudioPlayer'

class Content extends React.Component {
    render() {
        return (
            <div className="col-sm-8 conversation">
                <div className="row heading">
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
                        <i className="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
                    </div>
                </div>

                <div className="row message" id="conversation">
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
                
                <div className="row reply">
                    <div style={{ display: 'flex' }}>
                        <i className="fa fa-smile-o fa-2x" style={{ padding: '10px', color: '#93918f' }}></i>
                        <i className="fa fa-file-image-o fa-2x" style={{ padding: '10px', color: '#93918f' }}></i>
                        <i className="fa fa-file-o fa-2x" style={{ padding: '10px', color: '#93918f' }}></i>
                        <textarea className="form-control" rows="1" id="comment" style={{ marginLeft: '10px', marginRight: '10px' }}></textarea>
                        <i className="fa fa-microphone fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }}></i>
                        <i className="fa fa-send fa-2x" aria-hidden="true" style={{ padding: '10px', color: '#93918f' }}></i>
                    </div>
                </div>
            </div>
        )
    }
}

export default Content
