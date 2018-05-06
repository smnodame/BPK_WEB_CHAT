import React, { Component } from 'react'

const UserProfile = () => {
    return (
        <div className="col-sm-8 conversation">
            <div className="row heading">
                <a className="heading-name-meta">USER PROFILE
                </a>
            </div>
            <div>
                <form style={{ marginTop: '30px' }}>
                    <div className="col-md-12">
                        <div className="col-md-6" style={{ marginBottom: '20px' }}>
                            <img src="http://smnodame.com/public/profile.jpg" className="img-thumbnail" alt="Cinque Terre" width="150" height="150" /> 
                            <div class="form-group">
                                <label style={{ marginTop: '5px'}}>Profile</label>
                                <input type="file" className="form-control-file" id="exampleInputFile" aria-describedby="fileHelp" />
                            </div>
                        </div>
                        <div className="col-md-6" style={{ marginBottom: '20px' }}>
                            <img src="http://smnodame.com/public/pictures/11.jpg" className="img-thumbnail" alt="Cinque Terre" width="150" height="150" /> 
                            <div class="form-group">
                                <label style={{ marginTop: '5px'}}>Cover</label>
                                <input type="file" className="form-control-file" id="exampleInputFile" aria-describedby="fileHelp" />
                            </div>
                        </div>
                    </div>
                    
                    {/* <div className=" col-md-12">
                        <p style={{ color: 'gray' }}>Information</p>
                        <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
                    </div> */}
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Display Name</label>
                            <input type="text" className="form-control" placeholder="Display Name" />
                        </div>
                        <div className="form-group col-md-6">
                            <label>HN</label>
                            <input type="text" className="form-control"  placeholder="HN" />
                        </div>
                    </div>
                    <div className="form-group col-md-12">
                        <label>Status</label>
                        <input type="text" className="form-control" placeholder="Status" />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Password" />
                        </div>
                        <div className="form-group col-md-6">
                            <label>Confirm Password</label>
                            <input type="password" className="form-control"  placeholder="Confirm Password" />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginBottom: '10px' }}>
                        <small  className="form-text text-muted" >* leave the passwords empty, if you do not want to change</small>
                    </div>
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfile