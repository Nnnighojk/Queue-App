<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function __construct(){
		parent::__construct();
		header('Access-Control-Allow-Origin: *'); 
		$this->load->model('Admin_model');
		$this->load->model('Categories_model');
		$this->load->model('Queue_model');
		$this->load->model('Handler_model');
		$this->load->model('State_model');
		$this->load->model('City_model');		
	}	
	
	public function index()
	{
		echo "hello";
	}
	
	public function login(){
		
		//declare array to get username and password
		$value = array();
		$value["username"] = $this->input->get_post("username");
		$value["password"] = $this->input->get_post("password");
		$data = array();
		
		if($dataValues = $this->Admin_model->getWhere($value)){
			
			$data["status"] = 200;
			$data["message"] = "Logged Successfully";
			$data["data"] = $dataValues;;
		}else{
			$data["status"] = 100;
			$data["message"] = "Wrong username/password";			
		}
		
		echo json_encode($data);
	}
	
	public function getCategories(){
		$data = array();
		$data["status"] = 200;

		if($data["data"] = $this->Categories_model->getdata()){
			
		}else{
			$data["data"][0]["queue_category_name"] = "No data found"; 
		}
		
		echo json_encode($data);
	}

	public function createqueue(){
		$response = array();
		$value = array();
		$value1 = array();
		$condition = array();
		$condition1 = array();
		$value["category"] = $this->input->get_post("category");
		$value["city"] = $this->input->get_post("city");
		$value["close_day"] = $this->input->get_post("closeDay");
		$value["close_time"] = $this->input->get_post("endTime");
		$value1["handler_password"] = md5($this->input->get_post("handlerPassword"));
		$condition1["handler_username"] = $value1["handler_username"] = $this->input->get_post("handlerUsername");
		$condition["queue_name"] = $value["queue_name"] = $this->input->get_post("queueName");
		$value["start_time"] = $this->input->get_post("startTime");
		$value["state"] = $this->input->get_post("state");
		$value["created_date"] =  date("Y-m-d h:i:sa");
		$value["active_status"] = 1;
		//check for name if already exist
		if($temp = $this->Queue_model->getWhereData($condition)){
			$response["status"] = 100;
			$response["message"] = "Queue name is already used";
		}else{
			//check if same username password is present for handler
			if($temp = $this->Handler_model->getWhereData($condition1)){
				$response["status"] = 100;
				$response["message"] = "Handler username already used";				
			}else{
				$insertId = $this->Queue_model->insert($value);
				$value1["queue_id"] = $insertId;
				$this->Handler_model->insert($value1);
				$response["status"] = 200;
				$response["message"] = "Queue is created";				
			}
		}
		
		echo json_encode($response);		
	}
	
	//get category list city and state
	public function getRegDetails(){
		$response = array();
		$response["category"] = $this->Categories_model->getdata();
		$response["state"] = $this->State_model->getdata();
		$response["city"] = $this->City_model->getdata();
		$response["message"] = "Successfully"; 
		$response["code"] = 200;
		echo json_encode($response);
		
	}
	
	//get queue list by category name
	public function getQueueList(){
		$condition = array();
		$response = array();
		$data = array();
		$condition["category"] = $this->input->get_post("category_name");
		if($data = $this->Queue_model->getWheredata($condition)){
			$response["data"] = $data;
			$response["status"] = 200;			
		}else{
			$response["status"] = 100;
			$response["message"] = "No data found";	
		}
		
		echo json_encode($response);
	}
}
