package cm.study.gravitation.open.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 打开页面控制器
 * Created by chenming on 2017/7/21.
 */
@Controller
public class ViewController {

    @RequestMapping("/login")
    public String login() {
        System.out.println("--> login workflow");
        return "index";
    }
}
