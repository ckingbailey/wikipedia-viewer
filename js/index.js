var searchForm = document.forms['search-form'];

searchForm.addEventListener('submit', function(ev){
  var resultsNum = 10;
  ev.preventDefault();

  sendQry(this['search-field'].value, resultsNum);
});

function sendQry(srterm, num){
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php',
    data: { action: 'query',
           list: 'search',
           srsearch: srterm,
           srlimit: num,
           //prop: 'images',
           //imlimit: '1',
           format: 'json' },
    dataType: 'jsonp',
    success: function (json) {
      console.log(json.query.search[0] === undefined);
      if(document.querySelector('.resultBox').firstChild){
        reset();
      }
      if(!json.query.search[0]){
        var tryAgain = document.createElement('p');
        tryAgain.innerHTML = 'No results. Please try another search.';
        console.log(tryAgain);
        document.querySelector('.resultBox').appendChild(tryAgain);
        console.log(document.querySelector('.resultBox'));
      }
      makeCards(json)
      writeCards(json);
    },
    error: function(err) {
      alert('there was a problem with the request');
    }
  });
}

function makeCards(obj){
  var container = document.querySelector('.resultBox'),
      card;

  for(let i=0; i<obj.query.search.length; i++){
    card = document.createElement('div');
    card.classList.add('card');
    card.appendChild(document.createElement('h3')).classList.add('title');
    card.appendChild(document.createElement('p')).classList.add('snip');
    card.appendChild(document.createElement('a')).classList.add('link');
    container.appendChild(card);
  }
}

function writeCards(obj){
  var pees = document.querySelectorAll('.snip');
  var titles = document.querySelectorAll('.title');
  var links = document.querySelectorAll('.link');

  for(let i=0; i<obj.query.search.length; i++){
    titles[i].innerHTML = obj.query.search[i].title;
    pees[i].innerHTML = obj.query.search[i].snippet;
    links[i].setAttribute('href', 'https://en.wikipedia.org/wiki/' + obj.query.search[i].title.replace(' ', '_'));
    links[i].innerHTML = 'read more on Wikipedia';
  }
}

function reset(){
  var container = document.querySelector('.resultBox');
  while(container.firstChild){
    container.removeChild(container.firstChild);
  }
}

/*function genSrch(srterm){
  $.ajax({
    url: '//en.wikipedia.org/w/api.php',
    data: { action: 'query',
           generator: 'search',
           gsrsearch: srterm,
           gsrwhat: 'title',
           gsrlimit: '4',
           prop: 'images',
           imlimit: '1',
           format: 'json' },
    dataType: 'jsonp',
    success: function (x) {
      console.log(x.query.pages);
    }
  });
}*/
