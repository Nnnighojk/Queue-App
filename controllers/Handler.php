<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Handler extends CI_Controller {

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
		$this->load->model('Queue_date_wise_model');		
	}	
	
	public function index()
	{
		echo "hello";
	}
	
	public function login(){
		
		//declare array to get username and password
		$value = array();
		$value["handler_username"] = $this->input->get_post("username");
		$value["handler_password"] = md5($this->input->get_post("password"));
		
		$data = array();
		
		if($dataValues = $this->Handler_model->getWheredata($value)){
			
			$data["status"] = 200;
			$data["message"] = "Logged Successfully";
			$data["data"] = $dataValues;;
		}else{
			$data["status"] = 100;
			$data["message"] = "Wrong username/password";			
		}
		
		echo json_encode($data);
	}
	
	public function getDateWiseQueue(){
		$value = array();
		$condition = array();
		
		$condition["created_date_for"] = $this->input->get_post("created_date_for");
		$condition["queue_id"] = $this->input->get_post("queue_id");
		
		if($dataValues = $this->Queue_date_wise_model->getWheredata($condition)){
			$data["status"] = 200;
			$data["message"] = "";
			$data["data"] = $dataValues;;
		}else{
			$data["status"] = 100;
			$data["message"] = "No data found for this date.";			
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

	public function updateIstimateTimeResponse(){
		$value = array();
		$data = array();
		$condition = array();
		$condition["queue_id"] = $value["queue_id"] = $this->input->get_post("queue_id");
		$value["estimateTime"] = $this->input->get_post("estimateTime");
		$condition["created_date_for"] = $value["created_date_for"] = $this->input->get_post("created_date_for");
		if($ifPresent = $this->Queue_date_wise_model->getWheredata($condition)){
			$updateValue["queue_date_wise_id"] = $ifPresent[0]["queue_date_wise_id"];		
			$insertId = $this->Queue_date_wise_model->update($value, $updateValue);
			$data["status"] = 200;
			$data["message"] = "Estimate time updated successfully.";				
		}else{
			$insertId = $this->Queue_date_wise_model->insert($value);
			$data["status"] = 200;
			$data["message"] = "Estimate time updated successfully.";			
		}			
		
		echo json_encode($data);		
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
