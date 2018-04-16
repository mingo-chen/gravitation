package cm.study.gravitation.dao.http;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import retrofit2.Call;
import retrofit2.CallAdapter;
import retrofit2.Retrofit;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;

/**
 * Created by chenming on 2017/8/6.
 */
public class JSONAdapter extends CallAdapter.Factory {

    private static Logger ILOG = LoggerFactory.getLogger(JSONAdapter.class);

    @Override
    public CallAdapter<String, JSONObject> get(Type returnType, Annotation[] annotations, Retrofit retrofit) {

        return new CallAdapter<String, JSONObject>() {

            @Override
            public Type responseType() {
                return JSONObject.class;
            }

            @Override
            public JSONObject adapt(Call<String> call) {
                try {
                    String result = call.execute().body();
                    return JSON.parseObject(StringUtils.defaultIfBlank(result, "{}"));
                } catch (Exception e) {
                    ILOG.error("convert body error, body: {}", call.toString(), e);
                    return new JSONObject();
                }
            }
        };
    }
}
