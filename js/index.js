var searchForm = document.forms['search-form'];

searchForm.addEventListener('submit', function(ev){
  var resultsNum = 10;
  ev.preventDefault();
  
  sendQry(this['search-field'].value, resultsNum);
});

/*function submitSearch(form){
  //console.log(form['search-field'].value);
  sendQry(form['search-field'].value);
}*/

function sendQry(srterm, num){
  $.ajax({
    url: '//en.wikipedia.org/w/api.php',
    data: { action: 'query', 
           list: 'search',
           srsearch: srterm,
           srlimit: num,
           //prop: 'images',
           //imlimit: '1',
           format: 'json' },
    dataType: 'jsonp',
    success: function (json) {
      if(json.query.search[0] = undefined){
        var tryAgain = document.createElement('p');
        tryAgain.innerHTML = 'No results. Please try another search.';
        document.querySelector('.resultBox').appendChild(tryAgain);
      }
      makeCards(json.query.search.length)
      writeCards(json);
      console.log(json.query.search);
    },
    error: function(err) {
      alert('there was a problem with the request');
    }
  });
}

function makeCards(len){
  var container = document.querySelector('.resultBox'), 
      card;
  
  for(let i=0; i<len; i++){
    card = document.createElement('div');
    card.classList.add('card');
    card.appendChild(document.createElement('h3')).classList.add('title');
    card.appendChild(document.createElement('p')).classList.add('snip');
    card.appendChild(document.createElement('a')).classList.add('link');
    container.appendChild(card);
  }
}

function writeCards(len){
  var pees = document.querySelectorAll('.snip');
  var titles = document.querySelectorAll('.title');
  var links = document.querySelectorAll('.link');
  
  for(let i=0; i<len.query.search.length; i++){
    titles[i].innerHTML = len.query.search[i].title;
    pees[i].innerHTML = len.query.search[i].snippet;
    links[i].setAttribute('href', 'https://en.wikipedia.org/wiki/' + len.query.search[i].title.replace(' ', '_'));
    links[i].innerHTML = 'read more on Wikipedia';
  }
}

function reset(){
  
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