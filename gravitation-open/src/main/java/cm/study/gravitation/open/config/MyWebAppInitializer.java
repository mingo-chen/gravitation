package cm.study.gravitation.open.config;

import org.springframework.context.ApplicationContext;
import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import javax.servlet.annotation.WebServlet;

/**
 * Created by chenming on 2017/7/21.
 */
public class MyWebAppInitializer implements WebApplicationInitializer {

    /**
     * Servlet容器启动就会执行
     * @param servletContext
     * @throws ServletException
     */
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
//        servletContext.setInitParameter("contextConfigLocation", "classpath:/open/applicationContext.xml");
//
//        ServletRegistration.Dynamic registration = servletContext.addServlet("dispatcher", new DispatcherServlet());
//        registration.setLoadOnStartup(1);
//        registration.addMapping("/");
//        registration.setInitParameter("contextConfigLocation", "classpath:/open/dispatcher-servlet.xml");
//
//        servletContext.addListener(new ContextLoaderListener());

        AnnotationConfigWebApplicationContext appConfigContext = new AnnotationConfigWebApplicationContext();
        appConfigContext.register(AppConfig.class);
        servletContext.addListener(new ContextLoaderListener(appConfigContext));

        AnnotationConfigWebApplicationContext webConfigContext = new AnnotationConfigWebApplicationContext();
        webConfigContext.register(WebConfig.class);

        ServletRegistration.Dynamic registration = servletContext.addServlet("workflow", new DispatcherServlet(webConfigContext));
        registration.setLoadOnStartup(1);
        registration.addMapping("/");

    }
}
