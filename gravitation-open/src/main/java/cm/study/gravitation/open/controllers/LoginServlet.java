package cm.study.gravitation.open.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.*;

/**
 * Created by chenming on 2017/7/21.
 */
@WebServlet(name = "loginServlet", urlPatterns = "/login2", asyncSupported = true)
public class LoginServlet extends HttpServlet {

    private static Logger ILOG = LoggerFactory.getLogger(LoginServlet.class);

    private String successJsp = "WEB-INF/views/main.jsp";
    private String loginJsp = "WEB-INF/views/index.jsp";

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("--> servlet3 login...");
//        request.getRequestDispatcher(loginJsp).forward(request, response);

        response.setContentType("text/html;charset=GBK");
        response.setHeader("Cache-Control","private");
        response.setHeader("Pragma","no-cache");
        final PrintWriter writer= response.getWriter();
        writer.println("老师检查作业了:" + System.currentTimeMillis() + "<br/>");
        writer.flush();

        ILOG.info("开始做异步任务...");
        AsyncContext asyncContext = request.startAsync();
        asyncContext.setTimeout(30 * 1000L);
        asyncWorkMain(asyncContext);
        ILOG.info("完成做异步任务...");

        writer.println("老师布置作业:" + System.currentTimeMillis() + "<br/>");
        writer.flush();

    }

    private static final ExecutorService executorService = Executors.newFixedThreadPool(8);

    private void asyncWorkMain(AsyncContext asyncContext) {

        asyncContext.start(() -> {
                try {

                    Callable work1 = () -> {
                        PrintWriter writer = asyncContext.getResponse().getWriter();
                        for(int index = 0; index < 5; index++) {
                            writer.println("小明正在解答中...:" + System.currentTimeMillis() + "<br/>");
                            writer.flush();

                            Thread.sleep(2000L);
                            ILOG.info("完成任务:{}", index);
                        }

                        return true;
                    };

                    Future<Boolean> future1 = executorService.submit(work1);

                    Callable work2 = () -> {
                        PrintWriter writer = asyncContext.getResponse().getWriter();
                        for(int index = 0; index < 5; index++) {
                            writer.println("小红正在解答中...:" + System.currentTimeMillis() + "<br/>");
                            writer.flush();

                            Thread.sleep(2000L);
                            ILOG.info("完成任务:{}", index);
                        }

                        return true;
                    };

                    Future<Boolean> future2 = executorService.submit(work2);

                    if(future1.get() && future2.get()) { // 所有任务都完成
                        asyncContext.complete();
                    }
                } catch (Exception e) {
                    ILOG.error("--> ", e);
                }
        });

    }
}
