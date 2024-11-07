"use strict";

import Cat1 from "./img/1.jpg";
import Cat2 from "./img/2.jpg";
import Cat3 from "./img/3.jpg";
import Cat4 from "./img/4.jpg";
import Cat5 from "./img/5.jpg";
import Cat6 from "./img/6.jpg";
import Front from "./img/pentagram-on.png";

$(document).ready(function () {
  // Массив путей к файлам картинок
  const catPics = [Cat1, Cat2, Cat3, Cat4, Cat5, Cat6];

  // Массив с номерами классов, по которым будут генериться карты
  let objects = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6"],
    // Набор переменных для скоращения кода
    $container = $(".wraper"),
    $scorePanel = $(".score-panel"),
    $moves = $(".moves"),
    $timer = $(".timer"),
    $deck = $(".cards-wraper"),
    // Функциональные перменные, установленные в начальное значение
    nowTime,
    allOpen = [],
    match = 0,
    MAX_SECONDS = 59,
    second = MAX_SECONDS,
    moves = 0,
    wait = 2000,
    totalCard = objects.length / 2;

  // Функция перемешивания карт
  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // Функция, запускающая игру
  function init() {
    // Функция пермешивания тасует карты в случайном порядке в начале каждой игры
    let allCards = shuffle(objects);
    $deck.empty();

    // Игра начианется с нулевым количеством совпадений и сделанных ходов
    match = 0;
    moves = 0;
    $moves.text("0");

    // Создаем блоки с картами, каждая со своим числовым классом из массива objects и соответствующей картинкой
    for (let i = 0; i < allCards.length; i++) {
      $deck.append(
        $(
          '<div class="container"><div class="card ' +
            allCards[i] +
            '"><div class="front"><img src="' +
            Front +
            '"' +
            'alt = "" /></div ><div class="back"><img src="' +
            catPics[Number(allCards[i]) - 1] +
            '" alt="" /></div></div ></div>'
        )
      );
    }
    addCardListener();

    // Откатываем таймер к начальному значению при перезапуске игры
    resetTimer(nowTime);
    second = MAX_SECONDS;
    $timer.text(`${second}`);
    initTime();

    allOpen.length = 0;

    // Если время истекло, завершаем игру
    if (second < 0) {
      setTimeout(function () {
        gameOver(moves);
      }, 500);
    }
  }

  // По завершении раунда выводим на экран модальное окно с результатми
  function gameOver(moves) {
    if (totalCard === match) {
      $("#winnerText").text(
        `You win! In ${
          MAX_SECONDS - second
        } seconds, you did a total of ${moves} moves. Well done!`
      );
      $("#winnerModal").modal("toggle");
    } else {
      $("#winnerText").text(`You loose!`);
      $("#winnerModal").modal("toggle");
    }
    resetTimer(nowTime);
  }

  // Перезпуск игры при нажатии соответствующей кнопки в модальном окне
  $("button[id='goAgainAfterWinButton']").click(function () {
    init();
  });

  // Функция, открывающая карты по клику, сравнивающая их и определяющая пары
  let addCardListener = function () {
    // With the following, the card that is clicked on is flipped
    $deck.find(".card").on("click", function () {
      let $this = $(this);

      if (
        $this.hasClass("show") ||
        $this.hasClass("match") ||
        $this.hasClass("fliped")
      ) {
        return true;
      }

      let card = $this.attr("class").slice(5, 6);
      $this.addClass("fliped show");
      allOpen.push(card);

      // Помечает карты, если они совпали
      if (allOpen.length === 2) {
        if (card === allOpen[0]) {
          $deck.find(".fliped").addClass("match");
          setTimeout(function () {
            $deck.find(".fliped").removeClass("show");
          }, wait);
          match++;

          // Помечает карты, если они не совпали, и переворачивает их обратно
        } else {
          $deck.find(".fliped").not(".match").addClass("notmatch");
          setTimeout(function () {
            $deck.find(".fliped").removeClass("show");
          }, wait / 1.5);
        }

        // Увеличивает счетчик количества ходов
        moves++;

        // Передает кол-во ходов в модальное окно
        $moves.html(moves);

        // Когда открывается больше 2 карт, переворачиваем открытые рубашкой вверх, если они не совпали
      } else if (allOpen.length > 2) {
        $deck.find(".notmatch").removeClass("notmatch show fliped");
        allOpen.length = 0;
        allOpen.shift();
        allOpen.push(card);
      }
      // Завершаем игру, как только все карты открыты
      if (totalCard === match) {
        setTimeout(function () {
          gameOver(moves);
        }, 500);
      }
    });
  };

  // Функция запуска таймера и контроля времени игры
  function initTime() {
    nowTime = setInterval(function () {
      $timer.text(`${second}`);
      second = second - 1;
      if (second < 0) {
        gameOver(moves);
      }
    }, 1000);
  }

  // Функция перезапуска таймера при начале нового раунда
  function resetTimer(timer) {
    if (timer) {
      clearInterval(timer);
    }
  }

  init();
});
