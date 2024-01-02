import React, { Component } from 'react'
import ReactDOM from 'react-dom/client';

import UsersTable from "./components/users/UsersTable";
import LeftMenu from "./components/LeftMenu";
import Main from "./components/Main";
import AuthForm from "./components/users/AuthForm";
import EditCategory from "./components/categories/EditCategory";
import CategoriesTable from "./components/categories/CategoriesTable";
import ProductsTable from "./components/products/ProductsTable";
import EditProduct from "./components/products/EditProduct";

import './bootstrap';
import $ from 'jquery';
import {Route, Routes, BrowserRouter as Router, Navigate} from "react-router-dom";
import EditUser from "./components/users/EditUser";
window.$ = $;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount() {
        axios.get('/public/getuser')
        .then(response => {
            if (response.data.authenticated) {
                this.setState({ authenticated: true });
            } else {
                this.setState({ authenticated: true });
                if (location.pathname != '/public/') {
                    window.location.href = '/public';
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {

        let leftMenu = '';
        let routers =   <Routes>
                            <Route path="/public" element={<AuthForm/>}/>
                        </Routes>;

        if (this.state.authenticated && location.pathname != '/public/') {
            leftMenu = <LeftMenu/>;
            routers =  <Routes>
                <Route path="/public" element={<AuthForm/>}/>
                <Route path="/public/main" element={<Main/>}/>
                <Route path="/public/users" element={<UsersTable/>}/>
                <Route path="/public/users/add" element={<EditUser/>}/>
                <Route path="/public/users/:id" element={<EditUser/>}/>
                <Route path="/public/categories" element={<CategoriesTable/>}/>
                <Route path="/public/categories/add" element={<EditCategory/>}/>
                <Route path="/public/categories/:id" element={<EditCategory/>}/>
                <Route path="/public/products" element={<ProductsTable/>}/>
                <Route path="/public/products/add" element={<EditProduct/>}/>
                <Route path="/public/products/:id" element={<EditProduct/>}/>
            </Routes>
        }

        return (
            <Router>
                <div className="main-container">
                    {leftMenu}
                    {routers}
                </div>
            </Router>
        );

    }
}

export default App;

if (document.getElementById('app') != null) {
    ReactDOM.createRoot(document.getElementById('app')).render(
        <App/>
    );
}

$(window).mousemove(function (e) {
    var top = -4 * ((e.clientY / window.innerHeight) - 0.5);
    var left = -4 * ((e.clientX / window.innerWidth) - 0.5);
    $('.home-moving-img').css('transform', 'scale(1.1) translateY(' + top + '%) translateX(' + left + '%)');
});

