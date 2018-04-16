package cm.study.gravitation.dao.impl;

import cm.study.gravitation.dao.DataDao;
import com.alibaba.fastjson.JSONObject;
import mockit.Tested;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

/**
 * Created by chenming on 2017/8/6.
 */
public class DataDaoImplTest {



    @Test
    public void testGetMovieOfTop250() throws Exception {

    }

    public static void main(String[] args) {
        DataDaoImpl dataDao = new DataDaoImpl();
        JSONObject jsonObject = dataDao.getMovieOfTop250();
        System.out.println("--> " + jsonObject);
    }
}