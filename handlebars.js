(function() {
'use strict';

var people = [];
var ITEMS_KEY = 'LSDB_items';
var nextId = 1000;

getPeople( );
displayPeople( );

$('#new-person').on( 'click', addNewPerson );
$('#people').on( 'click', '.edit', editPerson );
$('#people').on( 'click', '.delete', confirmAndDeletePerson );


function getPeople( ) {
    try {
        var peopleString = localStorage[ ITEMS_KEY ];
        if ( peopleString ) {
            people = JSON.parse( peopleString );
            nextId = getNextId();
        }
    } catch ( excptn ) {
        console.error( 'Unable to read or parse localStorage items' );
    }  


    function getNextId() {
        var maxId = 1000;
        people.forEach( function( person ) {
            if ( +person._id > maxId ) {
                maxId = +person._id;
            }
        } );
        return maxId + 1;
    }
}


function displayPeople( ) {
    var i, len, person;
    var tr, td, button;

    $('#people').empty();

    for ( i = 0, len = people.length; i < len; ++i ) {
        person = people[ i ];

        tr = $( '<tr data-id="' + person._id + '">' );

        td = $( '<td>' );
        td.text( person.name );
        tr.append( td );

        td = $( '<td>' );
        td.text( person.age );
        tr.append( td );

        td = $( '<td>' );
        button = $( '<button type="button" class="edit">' );
        button.text( 'Edit' );
        td.append( button );
        button = $( '<button type="button" class="delete">' );
        button.text( 'Delete' );
        td.append( button );
        tr.append( td );

        $('#people').append( tr );
    }

    $('#table-page').show();
    $('#form-page').hide();
}


function addNewPerson( ) {
    addOrEditPerson( );
}


function editPerson( evt ) {
    var i = indexOfEventPerson( evt );
    if ( i >= 0 ) {
        addOrEditPerson( people[ i ] );
    }
}



function confirmAndDeletePerson( evt ) {
    var i = indexOfEventPerson( evt );
    if ( i >= 0 ) {
        if ( window.confirm( 'Are you sure you want to delete "' +
                             people[ i ].name + '"?' ) ) {
            deletePerson( i );
            displayPeople( );
        }
    }


    function deletePerson( idx ) {
        people.splice( idx, 1 );
        localStorage[ ITEMS_KEY ] = JSON.stringify( people );
    }
}


function indexOfEventPerson( evt ) {
    var btn = evt.target;
    var tr = $(btn).closest( 'tr' );
    var id = tr.attr( 'data-id' );
    var i, len;

    for ( i = 0, len = people.length; i < len; ++i ) {
        if ( people[ i ]._id === id ) {
            return i;
        }
    }
    return -1;
}

function addOrEditPerson( person ) {
    if ( person ) {
        $('#name').val( person.name );
        $('#age').val( person.age );
    } else {
        $('#name').val( '' );
        $('#age').val( '' );
    }
    $('#submit').one( 'click', addOrUpdatePerson );
    $('#cancel').one( 'click', displayPeople );

    $('#table-page').hide();
    $('#form-page').show();

    function addOrUpdatePerson( evt ) {
        var newPerson;

        evt.preventDefault( );

        if ( person ) {
            person.name = $('#name').val();
            person.age = $('#age').val();
        } else {
            newPerson = {
                _id: (nextId++).toString(),
                name: $('#name').val(),
                age: $('#age').val()
            };
            people.push( newPerson );
        }
        localStorage[ ITEMS_KEY ] = JSON.stringify( people );
        displayPeople( );
    }
}
})();

var source   = $("#entry-template").html();
var template = Handlebars.compile(source);



function showAddForm( ) {
    var html = entryTemplate( {} );
    $('#main').html( html );
    $('#submit').one( 'click', addPerson );
    $('#cancel').one( 'click', displayPeople );
  
  function showEditForm( evt ) {
    var btn = evt.target;
    var id = $(btn).attr( 'data-id' );
    var person = people.find( function( person ) {
        return person._id === id;
    } );
    var html = entryTemplate( person );
    $('#main').html( html );
    $('#submit').one( 'click', updatePerson );
    $('#cancel').one( 'click', displayPeople );
    evt.preventDefault( );
