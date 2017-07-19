var wikiSearch = function(form){
  var container = document.querySelector('.resultBox'),
      cards = {
        titles: [],
        pics: [],
        snips: [],
        links: []
      }, 
      card, i, page;

  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    sendQry(this['search-field'].value);
  });

  function sendQry(srterm){
    $.ajax({
      url: '//en.wikipedia.org/w/api.php',
      data: { action: 'query', 
             generator: 'search',
               gsrsearch: srterm,
               gsrlimit: 10,
             prop: 'pageimages|extracts',
               exchars: 100,
               exintro: 'true',
               explaintext: 'true',
               piprop: 'thumbnail',
               pithumbsize: '200',
             format: 'json' },
      dataType: 'jsonp',
      success: function (json) {
        if(container.firstChild){
          reset();
        }
        if(!json.query){
          var tryAgain = document.createElement('p');
          tryAgain.innerHTML = 'No results. Please try another search.';
          document.querySelector('.resultBox').appendChild(tryAgain);
        }
        makeCards(json);
        writeCards(json);
      },
      error: function(err) {
        alert('there was a problem with the request');
      }
    });
  }

  function makeCards(obj){
    for(pageid in obj.query.pages){
      card = document.createElement('div');
      card.classList.add('card');
      card.appendChild(document.createElement('h3')).classList.add('title');
      card.appendChild(document.createElement('img')).classList.add('leadImg');
      card.appendChild(document.createElement('p')).classList.add('snip');
      card.appendChild(document.createElement('a')).classList.add('link');
      container.appendChild(card);
    }
    cards.titles = document.querySelectorAll('.title');
    cards.pics = document.querySelectorAll('.leadImg');
    cards.snips = document.querySelectorAll('.snip');
    cards.links = document.querySelectorAll('.link');
  }

  function writeCards(obj){
    for(pageid in obj.query.pages){
      page = obj.query.pages[pageid];
      i = page.index - 1;
      cards.titles[i].innerHTML = page.title;
      if(page.thumbnail){ cards.pics[i].setAttribute('src', page.thumbnail.source); }
      cards.snips[i].innerHTML = page.extract;
      cards.links[i].setAttribute('href', 'http://en.wikipedia.org/wiki/' + page.title.replace(' ', '_'));
      cards.links[i].innerHTML = 'read more on Wikipedia';
    }
  }

  function reset(){
    while(container.firstChild){
      container.removeChild(container.firstChild);
    }
  }
}

wikiSearch(document.forms['search-form']);