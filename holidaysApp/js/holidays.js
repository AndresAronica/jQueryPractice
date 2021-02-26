// Declaraciones de funciones
// se asegura de que el documento esta listo para ser manipulado de manera segura
$(function(){
    let getCountries = function(){
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/all',
            // metodo a realizar
            type: 'GET',
            // tipo de dato que se espera devuelva el sv
            dataType: 'json',
            success: function(data) {
                // carga la select box con la lista de paises
                listCountries(data);
            },
            error: function() {
                alert('Hubo un problema con la llamada');
            }
        });
    }

    let listCountries = function(data) {
        // si ya hay un pais guardado en localStorage, directamente carga ese
        if (localStorage.country) {
            $('option:selected').text(localStorage.country);
        }

        // quiero html (y no text) porque para cargar los paises como elementos del select box necesito agregarles etiquetas html
        let countries = $('#countries').html();

        // hace la carga de los paises traidos desde getCountries al select box
        for (item in data) {
            countries += '<option value=' + data[item].alpha2Code + '>' + data[item].name + '</option>';
        }

        // lo pasa al elemento html
        $('#countries').html(countries);
    }

    let getHolidays = function(){
        previousYear = new Date().getFullYear() - 1;
        if(localStorage.id){
            $.ajax({
                url: 'https://holidayapi.com/v1/holidays',
                type: 'GET',
                dataType: 'json',
                // query string parameters necesarios para hacer la llamada. En este caso: pais, año y api key
                data: {
                    country: localStorage.id,
                    year: previousYear,
                    key: 'YOUR-HOLIDAYS-API-KEY'
                },
                success: function(data){
                    $('#selectedCountry').text(localStorage.country);
                    $('#selectedCountry').addClass('fw-bold');
                    $('#previousYear').text(previousYear);
                    listHolidays(data);
                },
                error: function(){
                    alert('Hubo un problema al cargar las festividades');
                }
            });
        }
    }

    let listHolidays = function(data){
        // se limpia el elemento, para sacar los placeholders
        $('#holidayList').html('');

        let holidays = $('#holidayList').html();

        for (item in data.holidays){
            if(data.holidays[item].public){
                holidays += '<li class=\'holidayItem list-group-item\'>' + data.holidays[item].date + ' - ' + data.holidays[item].name + '</li>';
            }
        }

        $('#holidayList').html(holidays);

        hoverHolidayItems();
    }

    let getFlag = function(){
        $.ajax({
            url: 'https://restcountries.eu/rest/v2/alpha/' + localStorage.id,
            type: 'GET',
            dataType: 'json',
            success: function(data){
                //$('#countryFlag').attr('src', data.flag);
                var tmpImg = new Image();
                tmpImg.src = data.flag;
                tmpImg.onload = function() {
                    $('#countryFlag').attr('src', tmpImg.src);
                };
            },
            error: function(){
                alert('No se cargo bien la bandera');
            }
        })
    }

    let hoverHolidayItems = function(){
        $('li').on({
            mouseenter: function(){
                $(this).addClass('bg-info');
                $(this).css('backgroundColor', 'white');
                //$(this).removeClass('bg-light');
            },
            mouseleave: function(){
                //$(this).addClass('bg-light');
                $(this).removeClass('bg-info');
            },
            click: function(){
                // La idea es que aca te muestre que dia cae esa fecha al hacer click
            }
        });
    }

    // ******************************************************************************** //

    // Llamadas a funciones
    getCountries();
    // Acciones al hacer hover sobre los list elements de festividades
    hoverHolidayItems();
    // Si ya hay un pais cargado, directamente hacer la llamada a la API
    if(localStorage.id){
        getHolidays();
    }

    // ******************************************************************************** //

    // Event listeners
    // controla si hay cambio en el select box de paises, y guarda en localStorage los valores necesarios
    $('#countries').on({
        change: function(){
            let selectedCountry = $('option:selected').text();
            let id = $('option:selected').val();
            localStorage.setItem('country', selectedCountry);
            localStorage.setItem('id', id);
            
            // trae las fechas festivas del pais seleccionado
            getHolidays();
            getFlag();
        }
    });

    // Manejador global, siempre que se haga una llamada AJAX va a mostrar el loader mientras se procesa
    $(document).bind('ajaxSend', function(){
        $('#loader').show();
    }).bind('ajaxComplete', function(){
        $('#loader').hide();
    });
});
