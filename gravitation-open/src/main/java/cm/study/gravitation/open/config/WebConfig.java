package cm.study.gravitation.open.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.ResourceBundleViewResolver;

/**
 * Created by chenming on 2017/7/21.
 * 用于取代dispatcher-servlet.xml
 */
@Configurable
@EnableWebMvc
@ComponentScan(basePackages = "cm.study.gravitation.open")
public class WebConfig /*extends WebMvcConfigurerAdapter*/{

    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }

//    @Override
//    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
////        super.configureDefaultServletHandling(configurer);
//        configurer.enable();
//    }
//
//    /**
//     * 静态资源映射
//     * @param registry
//     */
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/html/**").addResourceLocations("/html");
//        registry.addResourceHandler("/resources/**").addResourceLocations("/resources");
//    }


}
