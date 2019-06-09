'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://nursery.misfitsmarket.com/api/test/v1';
  const headers = {
    "X-Customer-Token": 721028102
  };
  function addClickEvt() {
    const items = document.querySelectorAll('.js-post');
    for (let i = 0, iLen = items.length; i < items.length; i++) {
      items[i].addEventListener('click', e => {
        const target = e.target.closest('.Products__grid-item');
        const id = target.dataset.id;
        const product = target.dataset.product;
        const price = target.dataset.price;
        const data = {
          id,
          product,
          price
        };
        axios.post(`${apiUrl}/${id}`, data, { headers })
          .then(res => {
            if (res.data.msg == 'Success') {
              document.querySelector('.js-success h1').innerHTML = `You picked ${res.data.data.youPicked}`
            }
          })
          .catch(e => console.log(e));
      });
    }
  }
  axios.get(apiUrl)
    .then(res => {
      if (res.data.msg === 'Success') {
        const items = res.data.data.items;
        const grid = document.querySelector('.js-grid');
        if (items.length > 0) {
          for (let i = 0, iLen = items.length; i < items.length; i++) {
            const div = document.createElement('div');
            div.dataset.id = items[i].id;
            div.dataset.product = items[i].product;
            div.dataset.price = items[i].price;
            div.classList.add('Products__grid-item', 'js-post');
            const img = document.createElement('img');
            img.src = 'https://via.placeholder.com/200/999999/FFFFFF/?text=placeholder';
            const p = document.createElement('p');
            p.innerHTML = items[i].product;
            const price = document.createElement('p');
            price.innerHTML = items[i].price;
            div.appendChild(img);
            div.appendChild(p);
            div.appendChild(price);
            grid.appendChild(div);
          }
        } else {
          grid.innerHTML = '<div class="Products__grid-item"><h1>Sold Out</h1></div>';
        }
        addClickEvt();
      } else {
        console.log(res.data);
      }
    }).catch(e => {
      console.log(e);
    })
});
