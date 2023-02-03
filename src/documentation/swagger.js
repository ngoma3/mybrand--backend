module.exports = {
    definition:{
        openapi: "3.0.3", // present supported openapi version
        info: {
        title: "Capstone APIs", // short title.
        description: "All API endpoints for Blogs, Users, Contancts", //  desc.
        version: "1.0.0", // version number
        contact: {
            name: "Ngoma Chris", // your name
            email: "ngomachrs@gmail.com", // your email
            url: "web.com", // your website
        },
        
        },
        servers: [
            {
                url:"https://real-pear-squid-shoe.cyclic.app",
                description: "Local server"
            }
        ],
        
        
          tags: [
            {
              name: "login", // name of a tag
              description: "Admin/User login"
            },
            {
              name: "Blogs", // name of a tag
              description: "CRUD operations"
            },
            {
              name: "Users", // name of a tag
              description: "CRUD operations"
            },
            {
              name: "Messages", // name of a tag
              description: "CRUD operations"
            },
        ],
        components: {
          schemas: {
            
            // todo model
            Blogs: {
              type: "object", // data type
              properties: {
                article: {
                  type: "string", // data-type
                  description: "The article of your blog", // desc
                  example: "Dev", // example of an id
                },
                category: {
                  type: "string", // data-type
                  description: "The article of your blog", // desc
                  example: "Dev", // example of an id
                },
                image: {
                  type: "file", // data-type
                  description: "image file", // desc
                },
                content: {
                  type: "string", // data type
                  example: "Dev", // example of an id
                },
              },
            },
            Comment: {
              type: "object", // data type
              properties: {
                comment: {
                  type: "string", // data-type
                },
              },
            },
            Msg: {
              type: "object", // data type
              properties: {
                name: {
                  type: "string", // data-type
                },
                email: {
                  type: "string", // data-type
                },
                content: {
                  type: "string", // data type
                },
              },
            },
            Users: {
              type: "object", 
              properties: {
                username: {
                  type: "string", 
                  example: "chris",
                },
                email: {
                  type: "string", 
                  example: "ngomachrs@gmail.com",
                },
                password: {
                  type: "string", 
                  example: "123",
                },
              },
            },
            
          },
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              name: "Authorization",
              in: "header",
            },
          },
        },
        

        paths: {
          '/auth/signup': {
            post: {
              tags: ['Users'],
              summary: 'User signup',
              parameters: [],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Users',
                    },
                    example: {
                      username: 'ngoma',
                      email: 'n@g.com',
                      password: 'nn',
                    },
                  },
                },
                required: true,
              },
              responses: {
                201: {
                  description: 'Signup successfully',
                },
                400: {
                  description: 'Bad Request',
                },
                
              },
            },
          },
          '/auth/login': {
              post: {
              tags: ['login'],
              summary: 'User login',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Users',
                    },
                    example: {
                      username:"ngoma",
                      password:"nn"
                    },
                  },
                },
                required: true,
              },
              responses: {
                200: {
                  description: 'logged in successfully',
                },
                404: {
                  description: 'Not found',
                },
              },
              }
          },
          '/auth/admin/login': {
            post: {
            tags: ['login'],
            summary: 'Admin login',
            requestBody: {
              content: {
                'application/json': {
                  example: {
                    username:"ngoma",
                    password:"ngoma"
                  },
                },
              },
              required: true,
            },
            responses: {
              200: {
                description: 'logged in successfully',
              },
              404: {
                description: 'Not found',
              },
            },
            }
        },
        '/auth':{
          get:{
            tags:['Users'],
            summary:'Get all Users',
            security: [{bearerAuth: []}],
            responses: {
              200: {
                description: 'successfully',
              },
          },
          }
          },
          '/auth/profile/{id}':{
            put:{
              tags:['Users'],
              summary:'Update Profile',
              security: [{bearerAuth: []}],
              parameters: [
                {
                   "in": "path",
                 "name": "id",
                  required: true,
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Users',
                    },
                  },
                },
                
              },
              responses: {
                200: {
                  description: 'profile updated successfully',
                },
                401: {
                  description: 'User Not Authorized',
                },
                404: {
                  description: 'Not found',
                },
              },
            }
          },
          '/auth/account/{id}':{
            delete:{
              tags:['Users'],
              summary:'remove User',
              security: [{bearerAuth: []}],
              parameters: [
                {
                   "in": "path",
                 "name": "id",
                  required: true,
                },
              ],
              responses: {
                200: {
                  description: 'successfully',
                },
                401: {
                  description: 'User Not Authorized',
                },
                404: {
                  description: 'Not found',
                },
              
              },
            }
          },
        '/blogs/':{
          get:{
            tags:['Blogs'],
            summary:'Get all blogs',
            responses: {
              200: {
                description: 'successfully',
              },
          },
          }
          },
          '/blogs/{id}/': {
            get: {

            tags: ['Blogs'],
            summary: 'Get single blog by id',
            parameters: [
              {
                 "in": "path",
               "name": "id",
                required: true,
              }
            ],
            responses: {
              200: {
                description: 'successfully',
              },
            },
            }
        },
        '/blogs':{
          post:{
            tags:['Blogs'],
            summary:'Create new blog',
            security: [{bearerAuth: []}],
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    $ref: '#/components/schemas/Blogs',
                  },
                },
              },
              required: true,
            },
            responses: {
              200: {
                description: 'successfully',
              },
              401: {
                description: 'User Not Authorized',
              },
              
            },
          }
        },
        '/blogs/blog/{id}':{
          put:{
            tags:['Blogs'],
            summary:'Update blog',
            security: [{bearerAuth: []}],
            parameters: [
              {
                 "in": "path",
               "name": "id",
                required: true,
              }
            ],
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    $ref: '#/components/schemas/Blogs',
                  },
                
                },
              },
              
            },
            responses: {
              200: {
                description: 'successfully',
              },
              401: {
                description: 'User Not Authorized',
              },
              404: {
                description: 'Not found',
              },
              500: {
                  description: 'Internal Server Error'
              }
            },
          }
        },
        '/blogs/{id}':{
          delete:{
            tags:['Blogs'],
            security: [{bearerAuth: []}],
            summary:'Delete blog article',
            parameters: [
              {
                 "in": "path",
               "name": "id",
                required: true,
              },
            ],
            responses: {
              200: {
                description: 'successfully',
              },
              401: {
                description: 'User Not Authorized',
              },
              404: {
                description: 'Article doesn\'t exist!',
              },
             
            },
          }
        },
        '/comments/{id}':{
          post:{
            tags:['Blogs'],
            summary:'Comment on blog article',
            security: [{bearerAuth: []}],
            parameters: [
              {
                 "in": "path",
               "name": "id",
                required: true,
              }],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Comment',
                  },
                  example: {
                    comment:"good content"
                  },
                },
              },
              required: true,
            },
            responses: {
              200: {
                description: 'Comment posted successfully',
              },
              401: {
                description: 'Not Authorized',
              },
              404: {
                description: 'Not found',
              },
              
            },
          }
        },
      
        '/messages':{
          post:{
            tags:['Messages'],
            summary:'Sending message',
            requestBody: {
              content: {
                'application/json': {
                  example: {
                    name:"chris",
                    email:"n@g.com",
                    content:"message"
                  },
                },
              },
              required: true,
            },
            responses: {
              200: {
                description: 'successfully',
              },
              500: {
                  description: 'Internal Server Error'
              }
            },
          }
        },
        '/messages/':{
          get:{
            tags:['Messages'],
            summary:'Get all messages',
            security: [{bearerAuth: []}],
            responses: {
              200: {
                description: 'successfully',
              },
              401: {
                description: 'Not Authorized',
              },
              500: {
                  description: 'Internal Server Error'
            },
          },
          }
          },
        
      
      '/messages/{id}': {
        delete: {
        tags: ['Messages'],
        summary: 'delete a message',
        security: [{bearerAuth: []}],
        parameters: [
          {
             "in": "path",
           "name": "id",
            required: true,
          }
        ],
        responses: {
          200: {
            description: 'successfully',
          },
          500: {
              description: 'Internal Server Error'
          }
        }
        }
      },
      },
    },
    apis: ["./routes/*.js"],
   
  };
