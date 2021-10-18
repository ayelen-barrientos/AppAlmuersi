
let mealsState= []
let ruta= 'login' //login, register, order
let user= {}

const stringToHTML = (s) => {//convertimos la plantilla que es un string a un documento html
    const parser = new DOMParser()
    const doc = parser.parseFromString(s, 'text/html')
   return doc.body.firstChild
}

const renderItem = (item) => {
    const element = stringToHTML(`<li data-id="${item._id}">${item.name}</li>`) //creamos una plantilla e insertamos un id a los platos de comida
    //escuchados de eventos
    element.addEventListener('click',() => {
        const mealsList = document.getElementById('meals-list')
        Array.from(mealsList.children).forEach(x => x.classList.remove('selected'))//transformamos mealsList en un array donde la iteramos para remover la clase 
        element.classList.add('selected')//agrega la clase a los elementos seleccionados 
        const mealsIdInput = document.getElementById('meals-id')
        mealsIdInput.value = item._id //asignamos el id del paton al input invisible por el usuario
    })
    return element
}

const renderOrder = (order, meals) => {
    const meal = meals.find(meal => meal._id === order.meals_id)//iteramos sobre el arreglo meals para encontrar el id del plato que le corresponde a la orden 
    const element = stringToHTML(`<li data-id="${order._id}">${meal.name}-${order.user_id}</li>`) //creamos la plantilla
    return element
}

const inicializaFormulario = () => {
    const token = localStorage.getItem('token')
    const orderForm = document.getElementById('order')//buscamos el from
    //escuchador de eventos
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const submit = document.getElementById('submit')
        submit.setAttribute('disabled',true)//cambiamos la propiedad del boton 
        const mealId = document.getElementById('meals-id')//buscamos el input que contiene el id del plato seleccionado 
        const mealIdValue = mealId.value//obtenes el id del plato
        console.log(mealIdValue);
        if(!mealIdValue){//validamos que el usuario alla elejido un plato
            alert('Debe seleccionar un plato')
            submit.removeAttribute('disabled')
            return 
        }

        const order = {
            meals_id: mealIdValue,
            user_id: user._id,
        }
        //mandamos la order al servidor
        fetch('http://localhost:3000/api/order',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                authorization: token,
            },
            body: JSON.stringify(order)
        }) 
        .then (x => x.json())
        .then(respuesta => {//resuesta del servidor
            const renderedOrder = renderOrder(respuesta, mealsState) 
            const ordersList = document.getElementById('orders-list')
            ordersList.appendChild(renderedOrder)
            submit.removeAttribute('disabled')
        })

    }

} 

const inicializaDatos = () => {
    fetch('http://localhost:3000/api/meal')
    //traemos(api) los datos(servidor) de los platos de comida y los mostramos en pantalla(cliente) 
    .then(response => response.json())
    .then(data => {
        console.log(data)
        mealsState = data//mandamos la lista de los meals a una variable global
        const mealsList = document.getElementById('meals-list')//obtenemos por el id el elemento del html  
        const submit = document.getElementById('submit')//buscamos el boton
        const lisItems = data.map(renderItem)
        mealsList.removeChild(mealsList.firstElementChild)//removemos el primer hijo que es la etiqueta <p> cargando
        lisItems.forEach(element => mealsList.appendChild(element));//iteramos sobre cada uno de los elementos del html y lo agregamos a mealsList
       
        submit.removeAttribute('disabled')//mientras la pagina se este cargando el boton va a estar bloqueado 
        
        fetch('http://localhost:3000/api/order')
            .then(res => res.json())
            .then(ordersData =>{
               console.log(ordersData)
                const ordersList = document.getElementById('orders-list')
                ordersList.removeChild(ordersList.firstElementChild)
                const listOrders = ordersData.hola(orderData => renderOrder(orderData,data))
                listOrders.forEach(element => ordersList.appendChild(element))
            })
    })
}

const renderApp =() => {
    const token = localStorage.getItem('token')//obtener el token
    if(token){//validando token
        user = JSON.parse(localStorage.getItem('user')) 
        return renderOrders()
    } 
    renderLogin()
}

const renderOrders = () => {
    const ordersView = document.getElementById('orders-view')
    document.getElementById('app').innerHTML = ordersView.innerHTML
    inicializaFormulario()
    inicializaDatos()
}


const renderLogin =()=>{

    const loginTemplate = document.getElementById('login-template') 
    document.getElementById('app').innerHTML = loginTemplate.innerHTML

    const loginForm = document.getElementById('login-form')//camturamos el formulario
    loginForm.onsubmit = (e) =>{//escuchador de eventos
        e.preventDefault()
        //campturamos los valores de los inputs
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json', },
        body: JSON.stringify({ email, password })//mandamos los datos al servidor
        })
        .then(x => x.json())
        .then(respuesta => {//el servidor nos devuelve el token
            localStorage.setItem('token', respuesta.token)//al guardar el token cada vez que se actualice la pagina vamos a saber si el usuario inicio sesion o no
            ruta = 'order'
            return respuesta.token
        })
        .then( token => {
            return fetch('http://localhost:3000/api/auth/me',{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            }) 
    
        })
        .then(x => x.json())
        .then(fetchedUser=> {
            localStorage.setItem('user', JSON.stringify(fetchedUser))
            user = fetchedUser
            renderOrders()
        })
    }
}

window.onload=() => {
    renderApp()  
}