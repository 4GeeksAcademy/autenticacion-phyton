const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: null,
		},
		actions: {
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error);
				}
			},
			login: async ({ email, password }) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/token`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email, password })
					});
			
					if (resp.ok) {  // Si el código de respuesta HTTP es 200
						const data = await resp.json();
						const token = data.token;
						setStore({ token: token });
						localStorage.setItem('token', token);
						return true;
					} else {
						return false;
					}
				} catch (error) {
					console.log("Error loading message from backend", error);
					return false;
				}
			},
			register: async ({ email, password }) => {
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/register`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, password }),
					});
					const data = await resp.json();

					if (resp.ok) {
						const token = data.token;

						setStore({ token: token });
						localStorage.setItem('token', token);

						// Redirigir a otra página después del registro, si es necesario.
						// Puedes usar window.location.href o una función de redirección de React Router.
					} else {
						console.log("Registration failed:", data.msg);
					}
				} catch (error) {
					console.log("Error during registration", error);
				}
			},
		},
	};
};

export default getState;
