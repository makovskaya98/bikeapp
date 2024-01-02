import React, {Component} from 'react';
import {Link, Navigate} from 'react-router-dom';
import axios from "axios";


class LeftMenu extends Component  {

    constructor(props) {
        super(props);
        this.state = {
            isLogout: false
        };
    }

    handleLogout = (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token');
        let self = this;
        axios.post("/public/logout", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(function (response) {
                localStorage.removeItem("token");
                self.setState({isLogout: true});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        if (this.state.isLogout) {
           window.location.href = '/public';
        }

        return (
            <div className="menu">
                <nav>
                    <ul>
                        <li>
                            <Link to="/public/main">
                                <span className="nav-item">
                                    <i className="bi bi-house"></i>
                                    <span>Главная</span>
                                </span>
                            </Link>
                            <Link to="/public/products">
                                <span className="nav-item">
                                    <i className="bi bi-cart-check"></i>
                                    <span>Товары</span>
                                </span>
                            </Link>
                            <Link to="/public/categories">
                                <span className="nav-item">
                                    <i className="bi bi-tags"></i>
                                    <span>Категории</span>
                                </span>
                            </Link>
                            <Link to="/public/users">
                                <span className="nav-item">
                                    <i className="bi bi-people"></i>
                                    <span>Пользователи</span>
                                </span>
                            </Link>
                            <Link onClick={this.handleLogout} className="">
                                <span className="nav-item">
                                    <i className="bi bi-box-arrow-in-left"></i>
                                    <span>Выход</span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default LeftMenu;
