<ul>
    <%for(var i = 0; i<data.length; i++){%>
        <li class="list-item" dataDistance=" <%= data[i].distance %> +'" dataBrand=" <%= data[i].name %> +'" dataStars=" <%= data[i].stars %> +'" dataPrice=" <%= data[i].low_price/100 %>+ '">
            <div class="list-img"><img src=" <%= data[i].image %>+" alt=""></div>
            <div class="list-detail">
                <p> <%= data[i].name %>+</p>
                <p><span><em>4.6分</em><em class="list-icon color-y">礼</em><em class="list-icon color-r">促</em><em class="list-icon color-b">返</em></span>
                    <span><em class="list-price">￥ <%= data[i].low_price/100 %> +</em><em>起</em></span></p>
                <p class="service-info"><span class=""> <%= data[i].stars %>+</span><span></span><span>P</span></p>
                <p><span> <%= data[i].addr %>+</span><span> <%= data[i].distance/1000 %> +km</span></p>
            </div>
        </li>
    <%}%>
</ul>