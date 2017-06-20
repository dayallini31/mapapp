var charts = Class.create({
    init: function (Constructor) {
        this.Constructor = Constructor;
    },
    populateChartsdropdown: function () {

        $.ajax({
            url: "../intern/data/ref.json",
            success: $.proxy(function (data) {
                var content = "";
                for (var i = 0; i < data.datasource.length; i++) {
                    content = content + '<option value="' + data.datasource[i].file + '">' + data.datasource[i].disp + '</option>';
                }
                $('#' + this.Constructor.dropdownBind).html(content);
            }, this)
        });

    },
    populateCharts: function () {

        var selected = $('#' + this.Constructor.dropdownBind).val();
        console.log(selected);

        var ctx = document.getElementById("myChart").getContext("2d");
        var Content = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Asia","Africa"],
                datasets: [{
                    label: 'Continent',
                    backgroundColor: "#ABE88F",
                    borderColor: "#6B8E5B",
                    borderWidth: 1,
                    data: [30,25]
                }]

            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Bar Chart'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                onClick: $.proxy(this.clearDataHandler,this)
            }
        });
     },

    clearDataHandler: function (e,y) {
        var label = y[0]['_view']['label'];
        




    }
});