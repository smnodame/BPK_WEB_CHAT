import React from 'react'

const Friend = ({ image, name, status }) => {
    return (
        <div className="row sideBar-body">
            <div className="col-sm-3 col-xs-3 sideBar-avatar">
                <div className="avatar-icon">
                    <img src={image} />
                </div>
            </div>
            <div className="col-sm-9 col-xs-9 sideBar-main">
                <div className="row">
                    <div className="col-sm-8 col-xs-8 sideBar-name">
                        <span className="name-meta">{name}
                        </span>
                        <span className="status-meta">{status}
                        </span>
                    </div>
                    <div className="col-sm-4 col-xs-4 pull-right sideBar-time">
                        <span className="time-meta pull-right">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friend