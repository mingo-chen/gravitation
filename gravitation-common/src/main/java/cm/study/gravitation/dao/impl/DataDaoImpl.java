package cm.study.gravitation.dao.impl;

import cm.study.gravitation.dao.DataDao;
import cm.study.gravitation.dao.http.DoubanHttpApi;
import com.alibaba.fastjson.JSONObject;
import retrofit2.Call;
import retrofit2.Retrofit;

/**
 * Created by chenming on 2017/8/6.
 */
public class DataDaoImpl implements DataDao {

    @Override
    public JSONObject getMovieOfTop250() {

        try {
            JSONObject callRT = DoubanHttpApi.douban.top250Movie(0, 10);
            return callRT;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
