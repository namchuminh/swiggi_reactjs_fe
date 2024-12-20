import { useContext, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa6";
import { FiDisc } from "react-icons/fi";
import { IoNavigate, IoSearchOutline } from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { RiMapPinLine, RiShoppingCartLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SidebarContext } from "../context/SidebarContext";
import { logout } from "../features/auth/authSlice";
import { fetchProvinces } from "../features/provinces/provinceSlice";
import { userProfile } from "../features/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const token = localStorage.getItem("accessToken");
  const { isActive, toggleSidebar } = useContext(SidebarContext);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(userProfile(token));
    }
  }, [dispatch, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetchAddress(latitude, longitude);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);
  const { provinces } = useSelector((state) => state.provinces);

  useEffect(() => {
    dispatch(fetchProvinces(1, 10));
  }, [dispatch]);

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSearchTerm("");
  };
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      if (data) {
        setUserAddress(data?.address?.city);
      } else {
        console.log("Unable to fetch address.");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      console.log("Error fetching address: " + error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const searchFilter = provinces.filter((province) => {
    return province.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <>
      <header className="section-header  ">
        <section className="header-main shadow-sm bg-white py-3">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-1">
                <Link to="/" className="brand-wrap mb-0">
                  <img alt="#" className="img-fluid" src="img/logo_web.png" />
                </Link>
              </div>
              <div className="col-3 d-flex align-items-center m-none">
                <div className="dropdown mr-3">
                  <Link
                    className="text-dark dropdown-toggle d-flex align-items-center py-3"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <div>
                      <RiMapPinLine className="mr-2" />
                    </div>

                    <div>
                      {selectedProvince || userAddress || "Chọn địa chỉ"}
                    </div>
                  </Link>
                  <div
                    className="dropdown-menu p-0 drop-loc"
                    aria-labelledby="navbarDropdown"
                  >
                    <div className="osahan-country">
                      <div className="search_location bg-primary p-3 text-right">
                        <div className="input-group rounded shadow-sm overflow-hidden">
                          <div className="input-group-prepend">
                            <button className="border-0 btn btn-outline-secondary text-dark bg-white btn-block">
                              <CiSearch />
                            </button>
                          </div>
                          <input
                            type="text"
                            className="shadow-none border-0 form-control"
                            placeholder="Tìm kiếm"
                            name="search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                      <div className="p-3 border-bottom">
                        <div
                          className="text-decoration-none cursor-pointer"
                          style={{
                            color: "black",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedProvince(userAddress)}
                        >
                          <p className="font-weight-bold text-primary m-0">
                            <IoNavigate className="mr-2" />

                            {userAddress || "Chọn địa chỉ"}
                          </p>
                        </div>
                      </div>
                      <div className="filter">
                        <h6 className="px-3 py-3 bg-light pb-1 m-0 border-bottom">
                          Chọn tỉnh/thành phố
                        </h6>
                        {searchFilter.map((province, index) => (
                          <div
                            key={index}
                            className="custom-control border-bottom px-0 custom-radio"
                          >
                            <input
                              type="radio"
                              id={`customRadio${index}`}
                              name="location"
                              className="custom-control-input"
                              value={province.name}
                              onChange={handleProvinceChange}
                              checked={selectedProvince === province.name}
                            />
                            <label
                              className="custom-control-label py-3 w-100 px-3"
                              htmlFor={`customRadio${index}`}
                            >
                              {province.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-8">
                <div className="d-flex align-items-center justify-content-end pr-5">
                  <Link to="/search" className="widget-header mr-4 text-dark">
                    <div className="icon d-flex align-items-center">
                      <IoSearchOutline className="h6 mr-2 mb-0" />

                      <span>Tìm kiếm</span>
                    </div>
                  </Link>

                  <Link
                    to="/offers"
                    className="widget-header mr-4 text-white btn bg-primary m-none"
                  >
                    <div className="icon d-flex align-items-center">
                      <FiDisc className="h6 mr-2 mb-0" />

                      <span>Ưu đãi</span>
                    </div>
                  </Link>
                  {token == null ? (
                    <Link
                      to="/login"
                      className="widget-header mr-4 text-dark m-none"
                    >
                      <div className="icon d-flex align-items-center">
                        <LuUser className="h6 mr-2 mb-0" />

                        <span>Đăng nhập</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="dropdown mr-4 m-none">
                      <Link
                        to="#"
                        className="dropdown-toggle text-dark py-3 d-block"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {user?.fullname || ""}{" "}
                      </Link>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <Link className="dropdown-item" to="/profile">
                          Tài khoản
                        </Link>
                        <Link className="dropdown-item" to="/faq">
                          Câu hỏi thường gặp
                        </Link>
                        <Link className="dropdown-item" to="/contact">
                          Liên hệ
                        </Link>
                        <Link className="dropdown-item" to="/terms">
                          Điều khoản sử dụng
                        </Link>
                        <Link className="dropdown-item" to="/privacy">
                          Chính sách bảo mật
                        </Link>
                        <button className="dropdown-item" onClick={handleLogout}>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}

                  <Link to="/checkout" className="widget-header mr-4 text-dark">
                    <div className="icon d-flex align-items-center">
                      <RiShoppingCartLine className="h6 mr-2 mb-0" />

                      <span>Giỏ hàng</span>
                    </div>
                  </Link>
                  <div onClick={toggleSidebar}>
                    <FaBars size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>
      {isActive && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Header;
