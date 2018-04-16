package cm.study.gravitation.dao.http;

import com.alibaba.fastjson.JSONObject;
import retrofit2.Retrofit;
import retrofit2.http.GET;
import retrofit2.http.Query;

/**
 * Created by chenming on 2017/8/6.
 * https://api.douban.com/v2/movie/top250?start=0&count=10
 */
public interface DoubanHttpApi {

    Retrofit FACTORY = new Retrofit.Builder()
            .baseUrl("https://api.douban.com")
            .addConverterFactory(new RawConverter())  // 把请求回来的数据进行转换
            .addCallAdapterFactory(new JSONAdapter()) // 把返回值Call<?> 进行转换
            .build();

    DoubanHttpApi douban = FACTORY.create(DoubanHttpApi.class);

    @GET("/v2/movie/top250")
    JSONObject top250Movie(@Query("start") int start, @Query("count") int count);
}
