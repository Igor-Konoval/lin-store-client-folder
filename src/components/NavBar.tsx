import React, {useEffect, useRef, useState} from 'react';
import {FC} from "react/index";
import {Form, Image, Nav, Navbar, NavDropdown} from 'react-bootstrap';
import {NavLink} from "react-router-dom";
import "../moduleCSS/NavBar.css"
import {UseAppDispatch, UseAppSelector} from "../hooks/redux";
import {BASKET_ROUTE, COMMENTS_ROUTE, LOGIN_ROUTE, ORDER_ROUTE, SAVE_LIST_ROUTE} from "../utils/consts";
import {getUsername} from "../http/userAPI";
import {logoutDispatch} from "../store/reducers/UserActionCreator";
import SearchComponent from "./SearchComponent";
import {fetchProducts} from "../store/reducers/ProductsActionCreator";
import {ProductItemsSlice} from "../store/reducers/ProductItemsSlice";
import UserProfile from "./UserProfile";
import {TypesFilterSlice} from "../store/reducers/FilterSlice";
const {selectSortPrice} = TypesFilterSlice.actions;
const {productsPage} = ProductItemsSlice.actions;
const {productsTypeId, setSearchValue, productsBrandId} = ProductItemsSlice.actions;

const NavBar:FC = () => {
    const isAuth = UseAppSelector(state => state.UserCheckSlice.isAuth);
    const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
    const navDropdownRef = useRef(null);
    const navDropdownCollapseRef = useRef(null);

    const dispatch = UseAppDispatch();

    const [jwt, setJwt] = useState<string>('');
    const [jwtRole, setJwtRole] = useState();

    useEffect(()=> {
        (async () => {
            const userData = await getUsername()
            setJwt(userData.username);
            setJwtRole(userData);
        })()
    }, [isAuth])

    const [searchExpanded, setSearchExpanded] = useState(false);

    const hideNavBar = (e) => {
        try {
            const target = e.target;
            if (!target.closest('.navbar') || target.closest('.dropdown-menu')) {
                if (navDropdownRef.current.classList.contains("show")) {
                    navDropdownCollapseRef.current.click();
                }
            }
        } catch (e) {
            return false
        }
    };

    useEffect(() => {
        document.addEventListener('click', hideNavBar);
        return () => {
            document.removeEventListener('click', hideNavBar);
        };
    }, []);

    const shortUsername = () => {
        if (jwt.length > 13) {
            return jwt.slice(0, 13) + "...";
        }
        return jwt;
    }

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded);
    };

    return (
            <>
                <Navbar
                    expand={"lg"}
                    role="navigation"
                    className="bg-body-tertiary d-flex justify-content-between container-navbar navbar-expand-md"
                    fixed="top"
                >
                    <NavLink
                        onClick={async () => {
                            dispatch(productsPage(1))
                            dispatch(setSearchValue(null))
                            dispatch(selectSortPrice(null))
                            await dispatch(fetchProducts(null, 1, 25, null, null, null, null, null));
                            dispatch(productsTypeId({name: "Категории", _id: null}));
                            dispatch(productsBrandId({name: "Бренды", _id: null}));
                        }}
                        to={'/'}
                        role="navigation"
                        className="container-logo-navBar"
                        style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "black",
                            margin: "10px 0 10px 0"
                        }}
                    >
                        <Image
                            src={process.env.REACT_APP_API_URL + '2logoStoret_2-removebg-preview.png'}
                            className="main-logo-navBar"
                            alt="main_image_Lin_Store"
                        />
                        <Image
                            src={process.env.REACT_APP_API_URL + 'shortMainLogo.png'}
                            className="short-main-logo-navBar"
                            alt="main_short_image_Lin_Store"
                        />
                    </NavLink>
                    <Form
                        className={`ml-auto d-flex form-search justify-content-end ${searchExpanded ? 'expanded' : ''}`}
                        onFocus={toggleSearch}
                        onBlur={toggleSearch}
                    >   <Image
                        className="img-search"
                        src={process.env.REACT_APP_API_URL + "search.png"}
                        alt="image_search"
                    />
                        <SearchComponent/>
                    </Form>
                    {
                        isAuth !== true
                            ?
                            <NavLink
                                className="px-sm-4 py-4 mx-lg-5 text-decoration-none text-black"
                                to={LOGIN_ROUTE}
                            >
                                Увійти
                            </NavLink>
                            :
                            <>
                                <Navbar.Toggle
                                    role="navigation"
                                    aria-controls="navbarScroll"
                                    ref={navDropdownCollapseRef}
                                    className="ms-sm-3"
                                />
                                <Navbar.Collapse
                                    role="navigation"
                                    ref={navDropdownRef}
                                    id="navbarScroll">
                                    <Nav
                                        className="navBar-nav-control me-auto my-2 my-lg-0"
                                        style={{ maxHeight: '100px' }}
                                        navbarScroll
                                    >
                                    </Nav>
                                    {jwtRole && jwtRole.role === "Admin" && (
                                        <NavLink to={"/admin"} style={{
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            color: "black",
                                            margin: "10px 0 10px 20px"
                                        }}
                                        className="order-sm-0"
                                        >
                                            адмін панель
                                            <Image
                                                style={{marginLeft: "3px"}}
                                                width={25}
                                                height={25}
                                                src={process.env.REACT_APP_API_URL + "administrator.png"}
                                                alt="image_administrator"
                                            />
                                        </NavLink>
                                    )}
                                    <>
                                        <div className="py-4 ps-1 pe-1 d-flex align-items-center">
                                            <NavDropdown
                                                title={shortUsername()}
                                                id="navbarScrollingDropdown"
                                            >
                                                <NavDropdown.Item
                                                    onClick={() => setShowUserProfile(true)}
                                                >
                                                    Профіль
                                                </NavDropdown.Item>
                                                <NavDropdown.Item
                                                    as="div"
                                                    role="div"
                                                    className="p-0"
                                                >
                                                    <NavLink
                                                        className="d-block navdrop-link text-decoration-none text-black"
                                                        to={ORDER_ROUTE}
                                                    >
                                                        Ваші замовлення
                                                    </NavLink>
                                                </NavDropdown.Item>
                                                <NavDropdown.Item
                                                    as="div"
                                                    role="div"
                                                    className="p-0"
                                                >
                                                    <NavLink
                                                        className="d-block navdrop-link text-decoration-none text-black"
                                                        to={SAVE_LIST_ROUTE}
                                                    >
                                                        Збережені товари
                                                    </NavLink>
                                                </NavDropdown.Item>
                                                <NavDropdown.Item
                                                    as="div"
                                                    role="div"
                                                    className="p-0"
                                                >
                                                    <NavLink
                                                        className="d-block navdrop-link text-decoration-none text-black"
                                                        to={COMMENTS_ROUTE}
                                                    >
                                                        Ваші відгуки/коментарі
                                                    </NavLink>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item onClick={()=> dispatch(logoutDispatch())}>
                                                    Вихід
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                            <Image
                                                style={{marginLeft: "3px"}}
                                                width={25}
                                                height={25}
                                                src={process.env.REACT_APP_API_URL + "account.png"}
                                                alt="image_account_user"
                                            />
                                        </div>
                                        <NavLink
                                            style={{ cursor: 'pointer' }}
                                            className="d-flex text-decoration-none text-black"
                                            to={BASKET_ROUTE}
                                        >
                                            <Image
                                                className="mx-1"
                                                width="23"
                                                height="23"
                                                src={process.env.REACT_APP_API_URL + "basket.png"}
                                                alt="image_basket"
                                            />
                                            <div>Кошик</div>
                                        </NavLink>
                                    </>
                                </Navbar.Collapse>
                            </>
                    }

                    <UserProfile show={showUserProfile} onHide={() => setShowUserProfile(false)}/>
                </Navbar>
                <div className="p-5"/>
            </>
    );
};

export default NavBar;