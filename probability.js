    // Output places
    var above = document.getElementById("above")
    var below = document.getElementById("below")
    var between = document.getElementById("between")

    var std_3 = document.getElementById("std_3")
    var std_2 = document.getElementById("std_2")
    var std_1 = document.getElementById("std_1")
    var std1 = document.getElementById("std1")
    var std2 = document.getElementById("std2")
    var std3 = document.getElementById("std3")

    // related to date
    let d = new Date()
    let dd = String(d.getDate()).padStart(2, '0');
    let mm = String(d.getMonth() + 1).padStart(2, '0');
    let yyyy = d.getFullYear();
    let today_string = yyyy + '-' + mm + '-' + dd;
    var today = new Date(today_string)

    let ms2day = (1000 * 60 * 60 * 24)
    // Elements with action
    var btn = document.querySelector("button")
    let date = document.getElementById('date')
    let days = document.getElementById('day')

    // =============== Actions ================
    //changing the days by changing the date
    date.addEventListener("change", () => {
      var date_goal = date.value
      date_goal = new Date(date_goal)

      var Difference_In_Time = (date_goal.getTime() - today.getTime()) / ms2day;
      days.value = (Math.floor(Difference_In_Time))
    })

    console.log("it is: " + today.getTime() / ms2day)

    days.addEventListener('keyup', () => {
      date_goal = new Date()

      ms_ahead = days.value * ms2day
      date_goal.setTime(today.getTime() + ms_ahead)

      let dg = String(date_goal.getDate() + 1).padStart(2, '0');
      let mg = String(date_goal.getMonth() + 1).padStart(2, '0');
      let yg = date_goal.getFullYear();
      let day_goal_string = yg + '-' + mg + '-' + dg;

      date.value = day_goal_string

    })

    // Calculate
    btn.addEventListener("click", () => {
      let p = document.getElementById('price').value
      let v = document.getElementById('volatility').value / 100
      let days_value = days.value
      let q1 = document.getElementById('first_target').value
      let q2 = document.getElementById('second_target').value

      p = parseFloat(p)
      v = parseFloat(v)
      days_value = parseFloat(days_value)
      q1 = parseFloat(q1)
      q2 = parseFloat(q2)


      var { pbelow, pabove1 } = calculate(p, q1, v, days_value / 365.25)
      var { pbelow1, pabove } = calculate(p, q2, v, days_value / 365.25)

      // For probability
      above.value = pabove.toFixed(3)
      below.value = pbelow.toFixed(3)
      between.value = Math.abs((100 - pabove - pbelow).toFixed(3))

      //For std
      let std = std_calculator(p, v, days_value / 365.25)
      std_3.value = std[0].toFixed(3)
      std_2.value = std[1].toFixed(3)
      std_1.value = std[2].toFixed(3)
      std1.value = std[3].toFixed(3)
      std2.value = std[4].toFixed(3)
      std3.value = std[5].toFixed(3)

    })

    function std_calculator(p, v, t) {
      let sd1 = p * v * Math.sqrt(t) // * 0.9322 
      std = [p - 3 * sd1, p - 2 * sd1, p - sd1, p + sd1, p + 2 * sd1, p + 3 * sd1]
      return std

    }

    function calculate(p, q, v, t) {

      vt = v * Math.sqrt(t)

      lnpq = Math.log(q / p)

      d1 = lnpq / vt

      y = Math.floor(1 / (1 + .2316419 * Math.abs(d1)) * 100000) / 100000
      z = Math.floor(.3989423 * Math.exp(-((d1 * d1) / 2)) * 100000) / 100000
      y5 = 1.330274 * Math.pow(y, 5)
      y4 = 1.821256 * Math.pow(y, 4)
      y3 = 1.781478 * Math.pow(y, 3)
      y2 = .356538 * Math.pow(y, 2)
      y1 = .3193815 * y
      x = 1 - z * (y5 - y4 + y3 - y2 + y1)
      x = Math.floor(x * 100000) / 100000

      if (d1 < 0) {
        x = 1 - x
      }
      pbelow = (x * 1000) / 10
      pabove = ((1 - x) * 1000) / 10


      return { pbelow, pabove }
    }