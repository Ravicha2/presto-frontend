import config from '../../backend.config.json';                                                                                                 
const BASE_URL = `http://localhost:${config.BACKEND_PORT}`;                                                                                     
             
// all abstracted REST api function
class API {                                                                                                                                     
    getToken() {                          
        return localStorage.getItem('token');
    }
                                                                                                                                                
    async request(method, path, body = null) {                                                                                                    
        const headers = { 'Content-Type': 'application/json' };                                                                                     
        const token = this.getToken();                                                                                                              
        if (token) {                        
        headers['Authorization'] = `Bearer ${token}`;                                                                                             
        }                                                                                                                                           
                                                                                                                                                    
        const res = await fetch(`${BASE_URL}${path}`, {                                                                                             
        method,                                                                                                                                   
        headers,                          
        body: body ? JSON.stringify(body) : null,                                                                                                 
        });                                                                                                                                         
                                                                                                                                                    
        const data = await res.json();                                                                                                              
        if (!res.ok) {                                                                                                                              
        throw new Error(data.error || 'Request failed');                                                                                          
        }                                                                                                                                           
        return data;                                                                                                                                
    }                                                                                                                                             
                                                                                                                                                
    GET(path) { return this.request('GET', path); }                                                                                               
    POST(path, body) { return this.request('POST', path, body); }
    PUT(path, body) { return this.request('PUT', path, body); }                                                                                   
    DELETE(path) { return this.request('DELETE', path); }                                                                                         
}                                                                                                                                               
                                                                                                                                                  
  export default new API(); 