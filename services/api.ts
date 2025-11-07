import axios, { type AxiosInstance } from "axios"

const API_BASE_URL = "https://it-literature-shop-backend-production.up.railway.app"

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }).then((res) => res.data),

  register: (username: string, email: string, password: string) =>
    apiClient.post("/auth/register", { username, email, password }).then((res) => res.data),

  getMe: (token: string) => apiClient.get("/auth/me").then((res) => res.data.data || res.data),
}

export const bookService = {
  getBooks: (params?: any) => apiClient.get("/books", { params }).then((res) => res.data),

  getBookById: (id: string) => apiClient.get(`/books/${id}`).then((res) => res.data.data || res.data),

  createBook: (data: any) => apiClient.post("/books", data).then((res) => res.data),

  updateBook: (id: string, data: any) => apiClient.patch(`/books/${id}`, data).then((res) => res.data),

  deleteBook: (id: string) => apiClient.delete(`/books/${id}`).then((res) => res.data),

  getGenres: () => apiClient.get("/genre").then((res) => res.data),
}

export const genreService = {
  getGenres: () => apiClient.get("/genre").then((res) => res.data),
}

export const orderService = {
  createOrder: (data: any) => apiClient.post("/transactions", data).then((res) => res.data),

  getOrders: (params?: any) => apiClient.get("/transactions", { params }).then((res) => res.data),

  getOrderById: (id: string) => apiClient.get(`/transactions/${id}`).then((res) => res.data),

  getStatistics: () => apiClient.get("/transactions/statistics").then((res) => {
    console.log("Statistics response:", res.data);
    return res.data.data || res.data;
  }),
}

export default apiClient