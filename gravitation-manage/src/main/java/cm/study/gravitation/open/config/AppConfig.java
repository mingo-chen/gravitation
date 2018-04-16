package cm.study.gravitation.open.config;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;

import javax.sql.DataSource;

/**
 * Created by chenming on 2017/7/21.
 */
@Configurable
@ComponentScan(basePackages = "cm.study.gravitation.open", excludeFilters = {@ComponentScan.Filter(value = Controller.class)})
@PropertySource("classpath:/open/mysql.properties")
public class AppConfig {

    @Value("${jdbc.driverClassName}")
    private String driverClassName;

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

//    @Bean(destroyMethod = "close")
    public DataSource dataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    /**
     * 必须加上static
     */
    @Bean
    public static PropertyPlaceholderConfigurer loadProperties() {
        PropertyPlaceholderConfigurer configurer = new PropertyPlaceholderConfigurer();
        ClassPathResource mysqlResource = new ClassPathResource("/open/mysql.properties");
        configurer.setLocations(mysqlResource);
        return configurer;
    }
}
