var wikiSearch = function(form){
  var container = document.querySelector('.resultBox'),
      searchForm = form['search-form'],
      searchField = searchForm['search-field'],
      card, cards, i, page,
      msnry = new Masonry(container, {
        itemSelector: '.card',
        columnWidth: '.column-sizer',
        percentPosition: true
      });

  searchField.addEventListener('focus', function(){
    var focusedEl;
    if(focusedEl === this) return; //field already focused. return so user can click to place cursor at specific point in input
    focusedEl = this;
    setTimeout(function(){
      focusedEl.select()
    }, 1);
  });

  searchForm.addEventListener('submit', function(ev){
    ev.preventDefault();

    sendQry('search', this['search-field'].value);
  });

  function buildData(act, srterm, num){
    var dataObj = srterm ? {
      generator: act,
      gsrsearch: srterm,
      gsrlimit: num || 10
    } : {
      generator: act,
      grnlimit: 1
    };
    return dataObj;
  }

  function sendQry(act, srterm, num){
    var qryData = buildData(act, srterm, num),
    sharedOutputs = {
      prop: 'pageimages|extracts',
        exchars: 100,
        exintro: 'true',
        explaintext: 'true',
        piprop: 'thumbnail',
        pithumbsize: '200',
      format: 'json'
    };

    Object.assign(qryData, sharedOutputs);

    console.log(qryData);

    $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: qryData,
      dataType: 'jsonp',
      success: function (json) {
        if(container.querySelector('.card')){
          msnry.colYs.fill(0);
          //msnry.options.colYs.fill(0);
          reset();
        }
        if(!json.query){
          var tryAgain = document.createElement('p');
          tryAgain.innerHTML = 'No results. Please try another search.';
          document.querySelector('.resultBox').appendChild(tryAgain);
        }
        else {
          makeCards(json);
          writeCards(json);
          imagesLoaded(container, function(){
            msnry.layout();
          });
        }
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
      cards.appendChild(card);
      msnry.appended(card);
    }
  }

  function writeCards(obj){
    for(pageid in obj.query.pages){
      page = obj.query.pages[pageid];
      i = page.index - 1;
      card = cards[i];
      card.querySelector('.title').innerHTML = page.title;
      if(page.thumbnail){
        card.querySelector('.leadImg').setAttribute('src', page.thumbnail.source);
      }
      card.querySelector('.snip').innerHTML = page.extract;
      card.setAttribute('href', 'http://en.wikipedia.org/wiki/' + page.title.replace(' ', '_'));
      card.querySelector('.link').innerHTML = 'read more on Wikipedia';
      card.querySelector('.link').setAttribute('target', '_blank');
    }
  }

  function reset(){
    while(container.querySelector('.card')){
      container.removeChild(container.querySelector('.card'));
    }
  }
}

wikiSearch(document.forms);
