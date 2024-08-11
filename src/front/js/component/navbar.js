import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const token = localStorage.getItem('token');
	const handleLogout = () => {
		localStorage.removeItem('token');
		window.location.replace('/login');
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{token ? (
						<button onClick={handleLogout} className="btn btn-primary">
							Logout
						</button>
					) : (
						<>
							<Link to="/login">
								<button className="btn btn-primary mx-2">Login</button>
							</Link>
							<Link to="/register">
								<button className="btn btn-secondary">Register</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
