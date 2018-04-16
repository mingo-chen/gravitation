package cm.study.gravitation.open.controllers;

import org.springframework.web.client.RestTemplate;
import org.testng.annotations.Test;

import java.net.URI;

import static org.testng.Assert.*;

/**
 * Created by chenming on 2017/7/21.
 */
public class HelloControllerTest {
    public static final String REST_SERVICE_URI = "http://workflow.meizu.com:8080/hello";

    @Test
    public void testGetting() throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String param = "content=hello, word";
        URI uri = restTemplate.postForLocation(REST_SERVICE_URI+"/geeting", param, String.class);
        if (null != uri){
            System.out.println("Location : "+uri.toASCIIString());
        } else {
            System.out.println("uri is null~");
        }

        String jsonResult = restTemplate.postForObject(REST_SERVICE_URI+"/geeting", param, String.class);
        System.out.println("testUser~" + jsonResult);
    }

    @Test
    public void testPostUser() throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String param = "k1=v1";
        URI uri = restTemplate.postForLocation(REST_SERVICE_URI+"/user1", param, String.class);
        if (null != uri){
            System.out.println("Location : "+uri.toASCIIString());
        } else {
            System.out.println("uri is null~");
        }

        String jsonResult = restTemplate.postForObject(REST_SERVICE_URI+"/user1", param, String.class);
        System.out.println("testUser~" + jsonResult);
    }

}