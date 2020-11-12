(function() {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', actualizarCliente)

        const parametrosURL = new URLSearchParams(window.location.search)
        idCliente = parametrosURL.get('id')

      if(idCliente){
           setTimeout(() => {
            editarCliente(idCliente)
           }, 500)
      }
    })

    function actualizarCliente(e){
        e.preventDefault();

        if(
            nombreInput.value === '' || emailInput.value === '' || 
            telefonoInput.value === '' || empresaInput.value === ''){

                imprimirAlerta('Todos los campos son obligatorios')
                return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: nombreInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['Datos'], 'readwrite')
        const objectStore = transaction.objectStore('Datos')

        objectStore.put(clienteActualizado)

        transaction.onerror = () => {
          imprimirAlerta('Hubo un error editando')
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Editado Correctamente')

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000)
        }

    }

    function editarCliente(id){
        const transaction = DB.transaction(['Datos'], 'readwrite')
        const objectStore = transaction.objectStore('Datos')

       const cliente = objectStore.openCursor()
       cliente.onsuccess = (e) => {
        const cursor = e.target.result;

        if(cursor){
            if(cursor.value.id === Number(id)){
                llenarFormulario(cursor.value)
            }
            cursor.continue();
        }
       }
    }

   function  llenarFormulario(datosClientes){
        const {nombre, email, telefono, empresa} = datosClientes;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
   }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('Datos', 1)

        abrirConexion.onerror = () => {
            console.log('Hubo un error')
        }

        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
        }
    }

    function imprimirAlerta(mensaje, tipo) {
    
        const alerta = document.querySelector('.alerta');
    
        if(!alerta) {
            // crear la alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    
            if(tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
    
            divMensaje.textContent = mensaje;
    
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
})()