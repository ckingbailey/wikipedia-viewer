var wikiSearch = function(form){
  var container = document.querySelector('.resultBox'),
      searchForm = form,
      searchField = searchForm['search-field'],
      card, cards, i, link, page,
      msnry = new Masonry(container, {
        itemSelector: '.card',
        columnWidth: '.column-sizer',
        percentPosition: true
      });

  //on 'focus' select text in searchField
  searchField.addEventListener('focus', function(){
    var focusedEl;
    if(focusedEl === this) return; //field already focused. return so user can click to place cursor at specific point in input
    focusedEl = this;
    setTimeout(function(){
      focusedEl.select()
    }, 1);
  });

//new random search
//takes a random response
//and makes a new search from it
  form['random'].addEventListener('click', function(ev){
    return sendQry('random', null, null, function(res) {
      var title = res.query.pages[Object.keys(res.query.pages)[0]].title;
      return sendQry('search', title, null, function(res) {
        return publishResponse(res);
      });
    });
  });

  searchForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    if(!this['search-field'].value){ return; }

    return sendQry('search', this['search-field'].value, null, function(res) {
      return publishResponse(res);
    });
  });

  function publishResponse(obj) {
    if (container.querySelector('.card') ||
        container.querySelector('.try-again')) {
      msnry.colYs.fill(0);
      reset();
    }
    if (!obj.query) {
      var tryAgain = document.createElement('p');
      tryAgain.classList.add('try-again');
      tryAgain.innerHTML = 'No results. Please try another search.';
      container.appendChild(tryAgain);
    }
    else {
      console.log('returned obj', obj);
      makeCards(obj);
      writeCards(obj);
      imagesLoaded(container, function(){
        msnry.layout();
      });
    }
  }

  function qrySpecifics(qryType, search, qryLimit){
    var qryData = search ? {
      gsrsearch: search,
      gsrlimit: qryLimit || 10
    } : {
      grnlimit: 1,
      grnnamespace: 0
    };
    return qryData;
  }

  function sendQry(gen, srterm, num, callback){
    var dataObj = qrySpecifics(gen, srterm, num),
        sharedInputs = {
          action: 'query',
          generator: gen,
          prop: 'pageimages|extracts',
            exchars: 100,
            exintro: 'true',
            explaintext: 'true',
            piprop: 'thumbnail',
            pithumbsize: '200',
          format: 'json'
        };
    console.log('outgoing dataObj', dataObj);

    Object.assign(dataObj, sharedInputs);

    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: dataObj,
      dataType: 'jsonp',
      success: function (json) {
        return callback(json);
/*----------------------------------------------------------
        if(container.querySelector('.card') || container.querySelector('.try-again')){
          msnry.colYs.fill(0);
          reset();
        }
        if(!json.query){
          var tryAgain = document.createElement('p');
          tryAgain.classList.add('try-again');
          tryAgain.innerHTML = 'No results. Please try another search.';
          container.appendChild(tryAgain);
        }
        else {
          console.log('returned obj', json);
          makeCards(json);
          writeCards(json);
          imagesLoaded(container, function(){
            msnry.layout();
          });
        }--------------------------------------------------*/
      },
      error: function(err) {
        alert('there was a problem with the request');
      }
    });
  }

  function makeCards(obj){
    cards = [];
    for(pageid in obj.query.pages){
      card = document.createElement('div');
      card.classList.add('card');
      card.appendChild(document.createElement('h3')).classList.add('title');
      card.appendChild(document.createElement('img')).classList.add('leadImg');
      card.appendChild(document.createElement('p')).classList.add('snip');
      card.appendChild(document.createElement('a')).classList.add('link')
      container.appendChild(card);
      cards.push(card);
      msnry.appended(card);
    }
  }

  function writeCards(obj){
    for(pageid in obj.query.pages){
      page = obj.query.pages[pageid];
      i = page.index - 1 || 0;
      card = cards[i].children;
      card[0].innerHTML = page.title;
      if(page.thumbnail){
        card[1].setAttribute('src', page.thumbnail.source);
      }
      card[2].innerHTML = page.extract;
      card[3].setAttribute('href', 'http://en.wikipedia.org/wiki/' + page.title.replace(' ', '_'));
      card[3].innerHTML = 'read more on Wikipedia';
      card[3].setAttribute('target', '_blank');
    }
  }

  function reset(){
    while(container.querySelector('.card')){
      container.removeChild(container.querySelector('.card'));
    }
    while(container.querySelector('.try-again')){
      container.removeChild(container.querySelector('.try-again'));
    }
  }
}

wikiSearch(document.forms['search-form']);
