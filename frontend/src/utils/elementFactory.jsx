import { v4 as uuidv4 } from 'uuid';

// element factory, function to create elements with default values
export const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  CODE: 'code'
}

const createElement = (type, {width, height}, layer) => ({
  id: uuidv4(),
  type,
  x: 0,
  y: 0,
  width: width ?? 50,
  height: height ?? 25,
  layer
});

export const createTextElement = (params, layer) => ({
  ...createElement(ELEMENT_TYPES.TEXT, params, layer),
  text: params.text ?? '',
  fontSize: params.fontSize ?? 1,
  color: params.color ?? '#000000',
});

export const createImageElement = (params, layer) => ({
  ...createElement(ELEMENT_TYPES.IMAGE, params, layer),
  src: params.src ?? '',
  alt: params.alt ?? '',
});

export const createVideoElement = (params, layer) => ({
  ...createElement(ELEMENT_TYPES.VIDEO, params, layer),
  src: params.src,
  autoplay: params.autoplay ?? false,
});

export const createCodeElement = (params, layer) => ({
  ...createElement(ELEMENT_TYPES.CODE, params, layer),
  code: params.code,
  fontSize: params.fontSize ?? 1,
  language: params.language ?? 'javascript'
});

export const DEFAULT_VALUES = {                                                             
  [ELEMENT_TYPES.TEXT]: {                                                                 
    width: 50,                                                                          
    height: 25,                                                                         
    text: '',                                                                           
    fontSize: 10,                                                                        
    color: '#FFFFFF'                                                                    
  },                                                                                      
  [ELEMENT_TYPES.IMAGE]: {                                                                
    width: 50,                                                                          
    height: 50,                                                                         
    src: '',                                                                            
    alt: ''                                                                             
  },                                                                                      
  [ELEMENT_TYPES.VIDEO]: {                                                                
    width: 60,                                                                          
    height: 45,                                                                         
    src: '',                                                                            
    autoplay: false,                                                                                                                                         
  },                                                                                      
  [ELEMENT_TYPES.CODE]: {                                                                 
    width: 60,                                                                          
    height: 30,                                                                         
    code: '',                                                                           
    language: 'javascript'                                                              
  }                                                                                       
};